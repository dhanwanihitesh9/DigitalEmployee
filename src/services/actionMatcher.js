const stringSimilarity = require("string-similarity");
const actionMappings = require("../config/actionMapping");
const logger = require("../utils/logger");

/**
 * Action Matcher
 * Uses string similarity to find the best matching action for an email
 */

class ActionMatcher {
  constructor() {
    this.similarityThreshold =
      parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.6;
  }

  /**
   * Find the best matching action for given email content
   * @param {string} subject - Email subject
   * @param {string} text - Email body text
   * @returns {Object|null} Matching action or null if no match found
   */
  findMatchingAction(subject, text) {
    const searchText = `${subject} ${text}`.toLowerCase();
    logger.info(`Searching for action match in: "${subject}"`);

    let bestMatch = {
      action: null,
      score: 0,
    };

    // Check each action mapping
    for (const mapping of actionMappings) {
      for (const pattern of mapping.patterns) {
        // Calculate similarity score
        const similarity = stringSimilarity.compareTwoStrings(
          pattern.toLowerCase(),
          searchText,
        );

        // Also check if pattern is contained in the text (exact substring match)
        const containsPattern = searchText.includes(pattern.toLowerCase());

        // Use the higher score
        const score = containsPattern ? Math.max(similarity, 0.8) : similarity;

        logger.debug(
          `Pattern "${pattern}" similarity score: ${score.toFixed(3)}`,
        );

        if (score > bestMatch.score) {
          bestMatch = {
            action: mapping,
            score: score,
          };
        }
      }
    }

    // Check if best match exceeds threshold
    if (bestMatch.score >= this.similarityThreshold) {
      logger.info(
        `Found matching action: ${bestMatch.action.method} ` +
          `(score: ${bestMatch.score.toFixed(3)})`,
      );
      return bestMatch.action;
    }

    logger.warn(
      `No matching action found. Best score: ${bestMatch.score.toFixed(3)} ` +
        `(threshold: ${this.similarityThreshold})`,
    );
    return null;
  }

  /**
   * Get unmatched response message
   * @param {string} senderEmail - Email of the sender
   * @returns {string} Polite response message
   */
  getUnmatchedResponse(senderEmail) {
    return (
      `Dear ${senderEmail},\n\n` +
      `Thank you for your email. Unfortunately, I was unable to identify ` +
      `the specific request you're making.\n\n` +
      `Could you please provide more details or rephrase your request? ` +
      `Alternatively, you may contact our support team directly for assistance.\n\n` +
      `I apologize for any inconvenience.\n\n` +
      `Best regards,\nDigital Employee`
    );
  }
}

module.exports = new ActionMatcher();
