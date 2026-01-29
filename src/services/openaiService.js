const OpenAI = require('openai');
const logger = require('../utils/logger');

/**
 * OpenAI Service
 * Handles interactions with OpenAI API for analysis
 */

class OpenAIService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize OpenAI client
   */
  initialize() {
    if (this.initialized) return;

    if (!process.env.OPENAI_API_KEY) {
      logger.error('OPENAI_API_KEY not found in environment variables');
      throw new Error('OPENAI_API_KEY is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.initialized = true;
    logger.info('OpenAI service initialized successfully');
  }

  /**
   * Analyze credit card statement and generate comprehensive report
   * @param {string} statementData - Credit card statement content
   * @returns {Promise<Object>} Analysis results with categories and recommendations
   */
  async analyzeCreditCardStatement(statementData) {
    if (!this.initialized) {
      this.initialize();
    }

    try {
      logger.info('Sending statement data to OpenAI for analysis...');

      const prompt = `You are a financial analyst specializing in credit card spending analysis for the UAE market.

Analyze the following credit card statement data and provide a comprehensive JSON response with the following structure:

{
  "spendingCategories": [
    {"category": "Category Name", "amount": 0, "percentage": 0, "transactionCount": 0}
  ],
  "topCategories": ["Top 3 categories by spend"],
  "mostFrequentTransactions": [
    {"merchant": "Merchant Name", "count": 0, "totalAmount": 0}
  ],
  "totalSpend": 0,
  "averageTransactionAmount": 0,
  "analysis": "Detailed spending pattern analysis",
  "recommendations": [
    {
      "cardName": "Credit Card Name",
      "bank": "Bank Name",
      "benefits": "Key benefits matching spending pattern",
      "annualFee": "Fee amount",
      "cashbackRate": "Cashback percentage"
    }
  ]
}

Credit Card Statement Data:
${statementData}

Based on the spending patterns, recommend the best credit cards available in the UAE market (Emirates NBD, ADCB, FAB, Mashreq, Dubai Islamic Bank, RAKBANK, etc.) that match the user's spending behavior.`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a financial analyst expert in credit card analysis and UAE banking products. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const analysisResult = JSON.parse(completion.choices[0].message.content);
      logger.info('Successfully received analysis from OpenAI');
      
      return analysisResult;
    } catch (error) {
      logger.error(`Error analyzing statement with OpenAI: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new OpenAIService();
