# Digital Employee

An intelligent email automation system that monitors an inbox and executes actions based on email content. The Digital Employee uses smart pattern matching to identify requests and automatically responds with appropriate actions.

## Features

- 📧 **Automated Email Monitoring** - Continuously monitors your inbox for new emails
- 🤖 **Intelligent Action Matching** - Uses string similarity algorithms to match email content with configured actions
- � **AI-Powered Credit Card Analysis** - Analyzes credit card statements using OpenAI GPT-4 with:
  - Automatic categorization of spending
  - Interactive pie charts showing category breakdowns
  - Most spent categories and frequent transactions analysis
  - Personalized credit card recommendations for UAE market
  - Beautiful HTML email reports
- 📎 **Attachment Processing** - Supports CSV, PDF, and TXT statement files
- 🔧 **Easily Configurable** - Simple configuration files for adding new actions and patterns
- 📝 **Comprehensive Logging** - Winston-based logging system tracks all activities
- 🔒 **Secure Configuration** - All credentials stored in environment variables
- 💬 **Polite Responses** - Sends friendly responses even when unable to match requests
- 🔄 **Auto-Reconnect** - Automatically reconnects if connection is lost
- 📅 **Date Filtering** - Only processes emails after a specified start date

## Project Structure

```
DigitalEmployee/
├── src/
│   ├── actions/
│   │   └── actionHandlers.js      # Action method implementations
│   ├── config/
│   │   └── actionMapping.js       # Email pattern to action mappings
│   ├── services/
│   │   ├── actionMatcher.js       # Smart pattern matching logic
│   │   ├── emailMonitor.js        # IMAP email monitoring service
│   │   └── emailSender.js         # SMTP email sending service
│   ├── utils/
│   │   └── logger.js              # Winston logger configuration
│   └── index.js                   # Application entry point
├── logs/                          # Log files (auto-created)
├── .env                           # Environment variables (create from .env.example)
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- An email account with IMAP/SMTP access enabled
- For Gmail: [App Password](https://support.google.com/accounts/answer/185833) (if 2FA is enabled)

## Installation

1. **Clone the repository**

   ```bash
   cd /Users/hiteshdhanwani/Documents/GitHub/DigitalEmployee
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your email credentials:

   ```env
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_HOST=imap.gmail.com
   EMAIL_PORT=993
   EMAIL_TLS=true

   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false

   CHECK_INTERVAL=60000
   LOG_LEVEL=info
   SIMILARITY_THRESHOLD=0.6
   START_DATE=2026-01-28
   
   # For Credit Card Analysis Feature
   OPENAI_API_KEY=your-openai-api-key
   ```

## 🎯 Credit Card Statement Analysis

The Digital Employee includes an advanced AI-powered credit card analysis feature. See [detailed documentation](docs/CREDIT_CARD_ANALYSIS.md).

### Quick Start

1. Send email with subject: `DIGITAL EMPLOYEE : Credit Card Statement Analysis`
2. Attach your credit card statement (CSV, PDF, or TXT)
3. Receive comprehensive HTML report with:
   - 📊 Spending breakdown pie chart
   - 💳 Category-wise analysis
   - 🔄 Most frequent transactions
   - 💎 UAE credit card recommendations

**Test with sample file**: [sample-statement.csv](sample-statement.csv)

## Configuration

### Adding New Actions

1. **Add action mapping** in `src/config/actionMapping.js`:

   ```javascript
   {
     patterns: [
       'your pattern 1',
       'your pattern 2',
       'your pattern 3'
     ],
     method: 'yourMethodName',
     description: 'Description of what this action does'
   }
   ```

2. **Implement the action handler** in `src/actions/actionHandlers.js`:
   ```javascript
   async yourMethodName(emailData) {
     logger.info(`Executing yourMethodName for: ${emailData.from}`);

     try {
       // Your business logic here

       const response = {
         success: true,
         message: `Your response message to the sender`
       };

       return response;
     } catch (error) {
       logger.error(`Error in yourMethodName: ${error.message}`);
       throw error;
     }
   }
   ```

### Adjusting Similarity Threshold

The `SIMILARITY_THRESHOLD` (default: 0.6) controls how strict the pattern matching is:

- **Lower values (0.4-0.6)**: More lenient, matches more broadly
- **Higher values (0.7-0.9)**: More strict, requires closer matches

## Usage

### Start the application

```bash
npm start
```

### Development mode (with auto-restart)

```bash
npm run dev
```

### Logs

Logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

Console output is also displayed with color-coded log levels.

## How It Works

1. **Email Monitoring**: The application connects to your email inbox via IMAP and listens for new unread emails.

2. **Pattern Matching**: When a new email arrives, the system:
   - Extracts the subject and body content
   - Compares against configured patterns using string similarity algorithms
   - Finds the best matching action

3. **Action Execution**: If a match is found above the threshold:
   - Executes the corresponding action method
   - Processes the request according to your business logic
   - Sends an automated response

4. **Unmatched Requests**: If no match is found:
   - Sends a polite response asking for clarification
   - Logs the unmatched request for review

## Example Actions

The application comes with four pre-configured example actions:

1. **Credit Card Evaluation** (`generateCardSummary`)
   - Triggers on: "credit card evaluation", "credit card request"
   - Action: Generates credit card evaluation summary

2. **Loan Application** (`processLoanApplication`)
   - Triggers on: "loan application", "apply for loan"
   - Action: Processes loan application request

3. **Account Statement** (`generateAccountStatement`)
   - Triggers on: "account statement", "statement request"
   - Action: Generates account statement

4. **Customer Support** (`handleSupportRequest`)
   - Triggers on: "customer support", "help", "support request"
   - Action: Creates support ticket

## Email Provider Setup

### Gmail

1. Enable IMAP in Gmail settings
2. Enable 2-Factor Authentication
3. Generate an [App Password](https://support.google.com/accounts/answer/185833)
4. Use the App Password in your `.env` file

### Outlook/Office365

```env
EMAIL_HOST=outlook.office365.com
EMAIL_PORT=993
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
```

### Other Providers

Check your email provider's documentation for IMAP/SMTP settings.

## Security Best Practices

- Never commit your `.env` file to version control
- Use app-specific passwords instead of your main email password
- Regularly rotate your credentials
- Review logs for suspicious activity
- Keep dependencies updated

## Troubleshooting

### Connection Issues

- Verify IMAP/SMTP is enabled in your email account
- Check firewall settings
- Ensure correct host, port, and credentials
- For Gmail, verify App Password is generated and used

### Not Receiving Responses

- Check SMTP configuration
- Review logs for sending errors
- Verify sender email address is correct

### Actions Not Matching

- Lower the `SIMILARITY_THRESHOLD` for more lenient matching
- Add more pattern variations in `actionMapping.js`
- Check logs to see similarity scores

## Development

### Adding Dependencies

```bash
npm install package-name
```

### Running Tests

```bash
# Tests can be added using Jest or Mocha
npm test
```

## License

ISC

## Support

For issues or questions, please check the logs in the `logs/` directory for detailed error information.

---

Built with Node.js, IMAP, and intelligent pattern matching.
