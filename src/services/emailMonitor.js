const Imap = require("imap");
const { simpleParser } = require("mailparser");
const logger = require("../utils/logger");
const actionMatcher = require("./actionMatcher");
const actionHandlers = require("../actions/actionHandlers");
const emailSender = require("./emailSender");

/**
 * Email Monitor Service
 * Monitors inbox and processes incoming emails
 */

class EmailMonitor {
  constructor() {
    this.imap = null;
    this.isConnected = false;
    this.processedEmails = new Set(); // Track processed emails to avoid duplicates
  }

  /**
   * Initialize IMAP connection
   */
  initialize() {
    logger.info("Initializing email monitor...");

    this.imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      tls: process.env.EMAIL_TLS === "true",
      tlsOptions: { rejectUnauthorized: false },
    });

    // Setup event handlers
    this.imap.once("ready", () => this.onReady());
    this.imap.once("error", (err) => this.onError(err));
    this.imap.once("end", () => this.onEnd());

    // Connect to the mail server
    this.imap.connect();
  }

  /**
   * Handle IMAP ready event
   */
  onReady() {
    logger.info("Email monitor connected and ready");
    this.isConnected = true;
    this.openInbox();
  }

  /**
   * Handle IMAP error event
   */
  onError(err) {
    logger.error(`IMAP error: ${err.message}`);
    this.isConnected = false;
  }

  /**
   * Handle IMAP end event
   */
  onEnd() {
    logger.info("Email monitor connection ended");
    this.isConnected = false;

    // Attempt to reconnect after a delay
    setTimeout(() => {
      logger.info("Attempting to reconnect...");
      this.initialize();
    }, 30000); // Reconnect after 30 seconds
  }

  /**
   * Open inbox and start monitoring
   */
  openInbox() {
    this.imap.openBox("INBOX", false, (err, box) => {
      if (err) {
        logger.error(`Failed to open inbox: ${err.message}`);
        return;
      }

      logger.info(`Inbox opened. Total messages: ${box.messages.total}`);

      // Check for new emails immediately
      this.checkNewEmails();

      // Listen for new mail events
      this.imap.on("mail", () => {
        logger.info("New mail notification received");
        this.checkNewEmails();
      });
    });
  }

  /**
   * Check for new unread emails after START_DATE
   */
  checkNewEmails() {
    logger.info("Checking for new unread emails after START_DATE...");

    // Build search criteria: UNSEEN + date filter
    const searchCriteria = ["UNSEEN"];
    
    if (process.env.START_DATE) {
      const startDate = new Date(process.env.START_DATE);
      // IMAP SINCE uses date in format: DD-MMM-YYYY
      const sinceDate = startDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/\//g, '-');
      
      searchCriteria.push(["SINCE", sinceDate]);
      logger.info(`Searching for emails SINCE: ${sinceDate}`);
    }

    this.imap.search(searchCriteria, (err, results) => {
      if (err) {
        logger.error(`Email search error: ${err.message}`);
        return;
      }

      if (!results || results.length === 0) {
        logger.info("No new unread emails found after START_DATE");
        return;
      }

      logger.info(`Found ${results.length} unread email(s) after START_DATE`);

      const fetch = this.imap.fetch(results, {
        bodies: "",
        struct: true,
        markSeen: false,
      });

      fetch.on("message", (msg, seqno) => {
        this.processMessage(msg, seqno);
      });

      fetch.once("error", (err) => {
        logger.error(`Fetch error: ${err.message}`);
      });

      fetch.once("end", () => {
        logger.info("Finished processing emails");
      });
    });
  }

  /**
   * Process individual email message
   */
  processMessage(msg, seqno) {
    logger.info(`Processing email #${seqno}`);

    msg.on("body", (stream) => {
      simpleParser(stream, async (err, parsed) => {
        if (err) {
          logger.error(`Email parsing error: ${err.message}`);
          return;
        }

        // Create unique identifier for this email
        const emailId = `${parsed.messageId || seqno}-${parsed.date}`;

        // Skip if already processed
        if (this.processedEmails.has(emailId)) {
          logger.info(`Email ${emailId} already processed, skipping`);
          return;
        }

        this.processedEmails.add(emailId);

        const emailData = {
          from: parsed.from.text,
          subject: parsed.subject || "",
          text: parsed.text || "",
          html: parsed.html || "",
          date: parsed.date,
          attachments: parsed.attachments || [],
        };

        logger.info(
          `Email from: ${emailData.from}, Subject: "${emailData.subject}", Date: ${emailData.date}, Attachments: ${emailData.attachments.length}`,
        );

        // Check if subject starts with required prefix (strict match)
        const requiredPrefix = "DIGITAL EMPLOYEE :";
        if (!emailData.subject.startsWith(requiredPrefix)) {
          logger.info(
            `Email subject does not start with "${requiredPrefix}" (strict match), ignoring email`,
          );
          // Mark as read to avoid processing again but DO NOT send any response
          this.markAsRead(seqno);
          return;
        }

        // Process the email
        await this.handleEmail(emailData, seqno);
      });
    });

    msg.once("end", () => {
      logger.debug(`Finished fetching message #${seqno}`);
    });
  }

  /**
   * Handle email and execute appropriate action
   */
  async handleEmail(emailData, seqno) {
    try {
      // Find matching action
      const matchingAction = actionMatcher.findMatchingAction(
        emailData.subject,
        emailData.text,
      );

      let response;

      if (matchingAction && actionHandlers[matchingAction.method]) {
        // Execute the matched action
        logger.info(`Executing action: ${matchingAction.method}`);
        response = await actionHandlers[matchingAction.method](emailData);
      } else {
        // No matching action found
        logger.warn("No matching action found for email");
        response = {
          success: false,
          message: actionMatcher.getUnmatchedResponse(emailData.from),
        };
      }

      // Send response email
      let sent;
      if (response.isHtml && response.html) {
        // Send HTML email with custom subject
        sent = await emailSender.sendEmail(
          emailData.from,
          response.subject || emailData.subject,
          response.message || 'Please view this email in HTML format.',
          response.html,
        );
      } else {
        // Send plain text email
        sent = await emailSender.sendEmail(
          emailData.from,
          emailData.subject,
          response.message,
        );
      }

      if (sent) {
        // Mark email as read after successful processing
        this.markAsRead(seqno);
      }
    } catch (error) {
      logger.error(`Error handling email: ${error.message}`);

      // Send error response to user
      try {
        await emailSender.sendEmail(
          emailData.from,
          emailData.subject,
          `Dear ${emailData.from},\n\n` +
            `We encountered an error while processing your request. ` +
            `Our team has been notified and will look into this issue.\n\n` +
            `Please try again later or contact support if the issue persists.\n\n` +
            `Best regards,\nDigital Employee`,
        );
      } catch (sendError) {
        logger.error(`Failed to send error response: ${sendError.message}`);
      }
    }
  }

  /**
   * Mark email as read
   */
  markAsRead(seqno) {
    this.imap.addFlags(seqno, ["\\Seen"], (err) => {
      if (err) {
        logger.error(`Failed to mark email as read: ${err.message}`);
      } else {
        logger.info(`Marked email #${seqno} as read`);
      }
    });
  }

  /**
   * Stop monitoring and disconnect
   */
  stop() {
    if (this.imap && this.isConnected) {
      logger.info("Stopping email monitor...");
      this.imap.end();
    }
  }
}

module.exports = new EmailMonitor();
