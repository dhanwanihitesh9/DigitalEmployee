const { parse } = require('csv-parse/sync');
const pdfParse = require('pdf-parse');
const logger = require('./logger');

/**
 * Statement Parser
 * Parses credit card statements from various formats
 */

class StatementParser {
  /**
   * Parse attachment based on file type
   * @param {Object} attachment - Email attachment object
   * @returns {Promise<string>} Parsed statement content
   */
  async parseAttachment(attachment) {
    logger.info(`Parsing attachment: ${attachment.filename}, Type: ${attachment.contentType}`);

    try {
      const fileType = this.getFileType(attachment);

      switch (fileType) {
        case 'csv':
          return await this.parseCSV(attachment.content);
        case 'pdf':
          return await this.parsePDF(attachment.content);
        case 'txt':
          return attachment.content.toString('utf-8');
        default:
          logger.warn(`Unsupported file type: ${fileType}`);
          return attachment.content.toString('utf-8');
      }
    } catch (error) {
      logger.error(`Error parsing attachment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Determine file type from attachment
   * @param {Object} attachment - Attachment object
   * @returns {string} File type
   */
  getFileType(attachment) {
    const filename = attachment.filename.toLowerCase();
    
    if (filename.endsWith('.csv')) return 'csv';
    if (filename.endsWith('.pdf')) return 'pdf';
    if (filename.endsWith('.txt')) return 'txt';
    
    // Check content type
    if (attachment.contentType.includes('csv')) return 'csv';
    if (attachment.contentType.includes('pdf')) return 'pdf';
    if (attachment.contentType.includes('text')) return 'txt';
    
    return 'unknown';
  }

  /**
   * Parse CSV file
   * @param {Buffer} buffer - File buffer
   * @returns {Promise<string>} Formatted CSV data
   */
  async parseCSV(buffer) {
    try {
      const content = buffer.toString('utf-8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      logger.info(`Parsed ${records.length} records from CSV`);

      // Format as readable text for OpenAI
      let formatted = 'Credit Card Transactions:\n\n';
      records.forEach((record, index) => {
        formatted += `Transaction ${index + 1}:\n`;
        Object.entries(record).forEach(([key, value]) => {
          formatted += `  ${key}: ${value}\n`;
        });
        formatted += '\n';
      });

      return formatted;
    } catch (error) {
      logger.error(`Error parsing CSV: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parse PDF file
   * @param {Buffer} buffer - File buffer
   * @returns {Promise<string>} Extracted PDF text
   */
  async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      logger.info(`Parsed PDF with ${data.numpages} pages`);
      return data.text;
    } catch (error) {
      logger.error(`Error parsing PDF: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new StatementParser();
