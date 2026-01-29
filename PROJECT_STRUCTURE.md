# Digital Employee - Complete Project Structure

```
DigitalEmployee/
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── .env                           # Environment variables (create from .env.example)
│   ├── .env.example                   # Environment template
│   ├── .gitignore                     # Git ignore rules
│   ├── README.md                      # Main documentation
│   └── SETUP.md                       # Setup checklist
│
├── 📁 src/
│   │
│   ├── 🎬 index.js                    # Application entry point
│   │
│   ├── 📁 actions/
│   │   └── actionHandlers.js          # ⭐ Action implementations
│   │       ├── generateCardSummary()   # AI-powered credit card analysis
│   │       ├── processLoanApplication()
│   │       ├── generateAccountStatement()
│   │       └── handleSupportRequest()
│   │
│   ├── 📁 config/
│   │   └── actionMapping.js           # Email pattern → method mappings
│   │
│   ├── 📁 services/
│   │   ├── emailMonitor.js            # 📧 IMAP email monitoring
│   │   ├── emailSender.js             # 📤 SMTP email sending (HTML support)
│   │   ├── actionMatcher.js           # 🎯 Pattern matching logic
│   │   ├── openaiService.js           # 🤖 OpenAI GPT-4 integration
│   │   └── chartService.js            # 📊 Pie chart generation
│   │
│   ├── 📁 utils/
│   │   ├── logger.js                  # 📝 Winston logging system
│   │   └── statementParser.js         # 📎 CSV/PDF/TXT parser
│   │
│   └── 📁 logs/                       # (auto-created)
│       ├── combined.log               # All logs
│       └── error.log                  # Error logs only
│
├── 📁 docs/
│   ├── CREDIT_CARD_ANALYSIS.md        # Credit card feature guide
│   └── QUICK_REFERENCE.md             # Quick command reference
│
└── 📄 sample-statement.csv            # Sample credit card statement for testing
```

## 🔑 Key Components

### Core Services

| Service | Purpose | Technology |
|---------|---------|------------|
| **emailMonitor.js** | Monitors inbox, fetches emails with attachments | IMAP, mailparser |
| **emailSender.js** | Sends text/HTML email responses | Nodemailer, SMTP |
| **actionMatcher.js** | Matches email content to actions | String similarity |
| **openaiService.js** | AI-powered statement analysis | OpenAI GPT-4 API |
| **chartService.js** | Generates spending visualizations | ChartJS Node Canvas |

### Action Handlers

| Handler | Trigger Keywords | Features |
|---------|-----------------|----------|
| **generateCardSummary** | credit card, statement, evaluation | • Attachment parsing<br>• OpenAI analysis<br>• Pie chart generation<br>• HTML email report<br>• UAE card recommendations |
| **processLoanApplication** | loan, application | Text response |
| **generateAccountStatement** | account statement | Text response |
| **handleSupportRequest** | support, help | Text response |

### Utilities

| Utility | Purpose |
|---------|---------|
| **logger.js** | Winston-based logging (file + console) |
| **statementParser.js** | Parse CSV, PDF, TXT attachments |

## 🔄 Application Flow

```
1. Email Arrives
   ↓
2. emailMonitor detects UNSEEN email
   ↓
3. Check: Date after START_DATE? → No → Mark as read, skip
   ↓ Yes
4. Check: Subject starts with "DIGITAL EMPLOYEE :"? → No → Mark as read, skip
   ↓ Yes
5. Extract: subject, body, attachments
   ↓
6. actionMatcher finds best matching action
   ↓
7. Execute action handler (e.g., generateCardSummary)
   ↓
   ├─→ Parse attachment (CSV/PDF/TXT)
   ├─→ Send to OpenAI for analysis
   ├─→ Generate pie chart
   └─→ Create HTML email
   ↓
8. emailSender sends response (text or HTML)
   ↓
9. Mark email as read
   ↓
10. Log all activities
```

## 📊 Data Flow - Credit Card Analysis

```
User Email (with CSV attachment)
   ↓
emailMonitor.processMessage()
   ↓
statementParser.parseAttachment()
   ├─→ CSV → parse() → formatted text
   ├─→ PDF → pdfParse() → extracted text
   └─→ TXT → direct read
   ↓
openaiService.analyzeCreditCardStatement()
   ├─→ Send to GPT-4
   └─→ Receive JSON analysis
   ↓
chartService.generatePieChart()
   ├─→ Create chart configuration
   └─→ Render to PNG buffer
   ↓
actionHandlers.generateStatementHTML()
   ├─→ Embed chart as base64
   ├─→ Format tables and sections
   └─→ Return complete HTML
   ↓
emailSender.sendEmail() with HTML
   ↓
User receives beautiful analysis report
```



## Deployment Checklist

- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Gmail App Password generated
- [ ] OpenAI API key added
- [ ] START_DATE set appropriately
- [ ] Logs directory writable
- [ ] Test email sent and processed
- [ ] Process manager configured (pm2)
- [ ] Monitoring set up
- [ ] Error alerting configured



---

**Version**: 1.0.0  
**Last Updated**: January 29, 2026  
**Maintained by**: Hitesh Dhanwani
