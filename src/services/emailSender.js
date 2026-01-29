const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

/**
 * Email Sender Service
 * Handles sending email responses
 */

class EmailSender {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize email transporter
   */
  async initialize() {
    if (this.initialized) return;

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Verify connection
      await this.transporter.verify();
      this.initialized = true;
      logger.info("Email sender initialized successfully");
    } catch (error) {
      logger.error(`Failed to initialize email sender: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send email response
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} text - Email body text
   * @param {string} html - Optional HTML body
   * @returns {Promise<boolean>} Success status
   */
  async sendEmail(to, subject, text, html = null) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      logger.info(`Sending email response to: ${to}`);

      const mailOptions = {
        from: `"Digital Employee" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
        text: text,
      };

      // Add HTML if provided
      if (html) {
        mailOptions.html = html;
      }

      const info = await this.transporter.sendMail(mailOptions);

      logger.info(`Email sent successfully. Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }
}

module.exports = new EmailSender();
