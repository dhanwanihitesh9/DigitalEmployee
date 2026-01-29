/**
 * Action Mapping Configuration
 * Maps email subject patterns to action methods
 *
 * Each mapping contains:
 * - patterns: Array of keywords/phrases to match against email subject/content
 * - method: Name of the method to execute
 * - description: Human-readable description of what the action does
 */

const actionMappings = [
  {
    patterns: [
      "credit card evaluation",
      "credit card request",
      "evaluate credit card",
      "card evaluation request",
    ],
    method: "generateCardSummary",
    description: "Generate credit card evaluation summary",
  },
  {
    patterns: [
      "loan application",
      "loan request",
      "apply for loan",
      "loan evaluation",
    ],
    method: "processLoanApplication",
    description: "Process loan application request",
  },
  {
    patterns: [
      "account statement",
      "statement request",
      "monthly statement",
      "generate statement",
    ],
    method: "generateAccountStatement",
    description: "Generate account statement",
  },
  {
    patterns: [
      "customer support",
      "help",
      "support request",
      "need assistance",
    ],
    method: "handleSupportRequest",
    description: "Handle customer support request",
  },
  // Add more mappings here as needed
];

module.exports = actionMappings;
