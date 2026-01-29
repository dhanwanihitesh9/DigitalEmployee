# Digital Employee - Quick Reference

## 📧 Email Subject Format

**REQUIRED**: All emails must start with `DIGITAL EMPLOYEE :` (case-sensitive, with space after colon)

## 🎯 Available Actions

### 1. Credit Card Statement Analysis

**Subject**: `DIGITAL EMPLOYEE : Credit Card Statement Analysis`  
**Attachment**: Credit card statement (CSV, PDF, TXT)  
**Response**: HTML email with comprehensive analysis

**Keywords**: credit card, statement, evaluation, analysis

### 2. Loan Application

**Subject**: `DIGITAL EMPLOYEE : Loan Application`  
**Response**: Loan processing confirmation

**Keywords**: loan, application, apply for loan

### 3. Account Statement

**Subject**: `DIGITAL EMPLOYEE : Account Statement Request`  
**Response**: Statement generation confirmation

**Keywords**: account statement, monthly statement

### 4. Customer Support

**Subject**: `DIGITAL EMPLOYEE : Help with my account`  
**Response**: Support ticket confirmation

**Keywords**: support, help, assistance

## ⚙️ Configuration Variables

```env
# Email Settings
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993

# Date Filter (only process emails after this date)
START_DATE=2026-01-28

# AI Features
OPENAI_API_KEY=sk-proj-your-key

# Matching Sensitivity (0.0 - 1.0)
SIMILARITY_THRESHOLD=0.6
```

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start the Digital Employee
npm start

# Development mode with auto-restart
npm run dev

# Check logs
tail -f logs/combined.log
```

## 📝 Logs Location

- **All logs**: `logs/combined.log`
- **Error logs**: `logs/error.log`
- **Console**: Real-time output when running

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Not receiving responses | Check subject starts with `DIGITAL EMPLOYEE :` (exact match) |
| IMAP error | Generate Gmail App Password at https://myaccount.google.com/apppasswords |
| OpenAI error | Verify API key in `.env` |
| Old emails being processed | Check `START_DATE` in `.env` |
| Action not matching | Lower `SIMILARITY_THRESHOLD` or add more patterns in `actionMapping.js` |

## 📊 Credit Card Analysis - Supported Formats

### CSV Example
```csv
Date,Merchant,Category,Amount,Currency
2026-01-15,Carrefour,Groceries,450.50,AED
```

### Required Fields
- Date (any format)
- Merchant/Description
- Amount (numeric)

## 🔐 Security Best Practices

1. ✅ Use App Passwords, not main email password
2. ✅ Never commit `.env` file
3. ✅ Rotate API keys regularly
4. ✅ Review logs for suspicious activity
5. ✅ Set appropriate `START_DATE` to avoid processing old emails

## 📞 Support

**Logs**: Check `logs/combined.log` for detailed error messages  
**Documentation**: See [README.md](../README.md) and [CREDIT_CARD_ANALYSIS.md](CREDIT_CARD_ANALYSIS.md)  
**Sample Files**: Use `sample-statement.csv` for testing
