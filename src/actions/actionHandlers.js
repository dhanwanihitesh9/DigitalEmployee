const logger = require("../utils/logger");
const openaiService = require("../services/openaiService");
const chartService = require("../services/chartService");
const statementParser = require("../utils/statementParser");

/**
 * Action Handlers
 * Each handler receives email data and returns a response
 */

class ActionHandlers {
  /**
   * Generate Credit Card Summary
   * @param {Object} emailData - Contains subject, from, text, html, attachments
   * @returns {Promise<Object>} Response with success, message, and html
   */
  async generateCardSummary(emailData) {
    logger.info(
      `Executing generateCardSummary for email from: ${emailData.from}`,
    );

    try {
      // Check if there are attachments
      if (!emailData.attachments || emailData.attachments.length === 0) {
        return {
          success: false,
          message:
            `Dear ${emailData.from},\n\n` +
            `Thank you for your credit card statement analysis request.\n\n` +
            `However, no statement file was attached to your email. ` +
            `Please resend your email with your credit card statement attached ` +
            `(supported formats: CSV, PDF, TXT).\n\n` +
            `Best regards,\nDigital Employee`,
        };
      }

      logger.info(`Processing ${emailData.attachments.length} attachment(s)`);

      // Parse the first attachment (statement file)
      const attachment = emailData.attachments[0];
      const statementContent =
        await statementParser.parseAttachment(attachment);

      logger.info("Statement parsed, sending to OpenAI for analysis...");

      // Analyze with OpenAI
      const analysis =
        await openaiService.analyzeCreditCardStatement(statementContent);

      logger.info("Analysis complete, generating pie chart...");

      // Generate pie chart
      const chartBuffer = await chartService.generatePieChart(
        analysis.spendingCategories,
      );
      const chartBase64 = chartBuffer.toString("base64");

      logger.info("Generating HTML report...");

      // Generate HTML email
      const htmlContent = this.generateStatementHTML(
        emailData.from,
        analysis,
        chartBase64,
      );

      const response = {
        success: true,
        isHtml: true,
        html: htmlContent,
        subject: "Your Credit Card Statement Analysis Report",
      };

      logger.info(`Successfully generated card summary for: ${emailData.from}`);
      return response;
    } catch (error) {
      logger.error(`Error in generateCardSummary: ${error.message}`);

      return {
        success: false,
        message:
          `Dear ${emailData.from},\n\n` +
          `We encountered an error while analyzing your credit card statement: ${error.message}\n\n` +
          `Please ensure your file is in a supported format (CSV, PDF, or TXT) and try again.\n\n` +
          `Best regards,\nDigital Employee`,
      };
    }
  }

  /**
   * Generate HTML report for credit card analysis
   * @param {string} recipient - Recipient email
   * @param {Object} analysis - Analysis data from OpenAI
   * @param {string} chartBase64 - Base64 encoded chart image
   * @returns {string} HTML content
   */
  generateStatementHTML(recipient, analysis, chartBase64) {
    const categoryRows = analysis.spendingCategories
      .map(
        (cat) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${cat.category}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">AED ${cat.amount.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">${cat.percentage.toFixed(1)}%</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${cat.transactionCount}</td>
        </tr>
      `,
      )
      .join("");

    const topCategoriesList = analysis.topCategories
      .map((cat) => `<li style="margin: 8px 0; color: #555;">${cat}</li>`)
      .join("");

    const frequentTransactions = analysis.mostFrequentTransactions
      .map(
        (tx) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${tx.merchant}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${tx.count}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">AED ${tx.totalAmount.toFixed(2)}</td>
        </tr>
      `,
      )
      .join("");

    const recommendationCards = analysis.recommendations
      .map(
        (card) => `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 15px 0; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px 0; font-size: 22px;">${card.cardName}</h3>
          <p style="margin: 5px 0; opacity: 0.9;"><strong>Bank:</strong> ${card.bank}</p>
          <p style="margin: 5px 0; opacity: 0.9;"><strong>Annual Fee:</strong> ${card.annualFee}</p>
          <p style="margin: 5px 0; opacity: 0.9;"><strong>Cashback Rate:</strong> ${card.cashbackRate}</p>
          <p style="margin: 10px 0 0 0; line-height: 1.6;">${card.benefits}</p>
        </div>
      `,
      )
      .join("");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Card Statement Analysis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 800px; margin: 0 auto; background-color: white; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Credit Card Statement Analysis</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Comprehensive Spending Report</p>
    </div>

    <!-- Content -->
    <div style="padding: 30px;">
      
      <!-- Greeting -->
      <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear ${recipient},</p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Thank you for using our Digital Employee service. We've analyzed your credit card statement 
        and prepared a comprehensive report with insights and recommendations.
      </p>

      <!-- Summary Stats -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0;">
        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; text-align: center; border-left: 4px solid #667eea;">
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Total Spend</div>
          <div style="font-size: 28px; font-weight: bold; color: #333;">AED ${analysis.totalSpend.toFixed(2)}</div>
        </div>
        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; text-align: center; border-left: 4px solid #764ba2;">
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Avg Transaction</div>
          <div style="font-size: 28px; font-weight: bold; color: #333;">AED ${analysis.averageTransactionAmount.toFixed(2)}</div>
        </div>
      </div>

      <!-- Spending Chart -->
      <div style="margin: 30px 0;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          📊 Spending Breakdown
        </h2>
        <div style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 10px;">
          <img src="data:image/png;base64,${chartBase64}" alt="Spending Chart" style="max-width: 100%; height: auto; border-radius: 8px;" />
        </div>
      </div>

      <!-- Category Details -->
      <div style="margin: 30px 0;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          💳 Spending by Category
        </h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 15px; text-align: left;">Category</th>
              <th style="padding: 15px; text-align: right;">Amount</th>
              <th style="padding: 15px; text-align: right;">Percentage</th>
              <th style="padding: 15px; text-align: center;">Transactions</th>
            </tr>
          </thead>
          <tbody>
            ${categoryRows}
          </tbody>
        </table>
      </div>

      <!-- Top Categories -->
      <div style="margin: 30px 0;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          🏆 Top Spending Categories
        </h2>
        <ul style="background: #f8f9fa; padding: 20px 40px; border-radius: 10px; line-height: 1.8;">
          ${topCategoriesList}
        </ul>
      </div>

      <!-- Frequent Transactions -->
      <div style="margin: 30px 0;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          🔄 Most Frequent Transactions
        </h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #764ba2; color: white;">
              <th style="padding: 15px; text-align: left;">Merchant</th>
              <th style="padding: 15px; text-align: center;">Count</th>
              <th style="padding: 15px; text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${frequentTransactions}
          </tbody>
        </table>
      </div>

      <!-- Analysis -->
      <div style="margin: 30px 0;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          📈 Spending Analysis
        </h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; line-height: 1.8; color: #555;">
          ${analysis.analysis}
        </div>
      </div>

      <!-- Recommendations -->
      <div style="margin: 30px 0;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          💎 Recommended Credit Cards for UAE
        </h2>
        <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
          Based on your spending patterns, here are the best credit card options available in the UAE market:
        </p>
        ${recommendationCards}
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        This analysis was generated by your Digital Employee<br>
        Powered by AI • ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>

  </div>
</body>
</html>
    `;
  }

  /**
   * Process Loan Application
   * @param {Object} emailData - Contains subject, from, text, html
   * @returns {Promise<Object>} Response with success and message
   */
  async processLoanApplication(emailData) {
    logger.info(
      `Executing processLoanApplication for email from: ${emailData.from}`,
    );

    try {
      // Add your loan processing logic here

      const response = {
        success: true,
        message:
          `Dear ${emailData.from},\n\nThank you for your loan application.\n\n` +
          `Your application has been received and is being processed. ` +
          `We will evaluate your request and get back to you within 5 business days.\n\n` +
          `Application Reference: LOAN-${Date.now()}\n\n` +
          `Best regards,\nDigital Employee`,
      };

      logger.info(
        `Successfully processed loan application for: ${emailData.from}`,
      );
      return response;
    } catch (error) {
      logger.error(`Error in processLoanApplication: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate Account Statement
   * @param {Object} emailData - Contains subject, from, text, html
   * @returns {Promise<Object>} Response with success and message
   */
  async generateAccountStatement(emailData) {
    logger.info(
      `Executing generateAccountStatement for email from: ${emailData.from}`,
    );

    try {
      // Add your statement generation logic here

      const response = {
        success: true,
        message:
          `Dear ${emailData.from},\n\nYour account statement request has been received.\n\n` +
          `We are generating your monthly statement and will send it to you shortly. ` +
          `Please allow 1-2 hours for processing.\n\n` +
          `Request ID: STMT-${Date.now()}\n\n` +
          `Best regards,\nDigital Employee`,
      };

      logger.info(
        `Successfully generated account statement for: ${emailData.from}`,
      );
      return response;
    } catch (error) {
      logger.error(`Error in generateAccountStatement: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle Support Request
   * @param {Object} emailData - Contains subject, from, text, html
   * @returns {Promise<Object>} Response with success and message
   */
  async handleSupportRequest(emailData) {
    logger.info(
      `Executing handleSupportRequest for email from: ${emailData.from}`,
    );

    try {
      // Add your support handling logic here

      const response = {
        success: true,
        message:
          `Dear ${emailData.from},\n\nThank you for contacting our support team.\n\n` +
          `Your support request has been logged and assigned to a specialist. ` +
          `We aim to respond to all inquiries within 24 hours.\n\n` +
          `Ticket Number: SUP-${Date.now()}\n\n` +
          `Best regards,\nDigital Employee Support`,
      };

      logger.info(
        `Successfully handled support request for: ${emailData.from}`,
      );
      return response;
    } catch (error) {
      logger.error(`Error in handleSupportRequest: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ActionHandlers();
