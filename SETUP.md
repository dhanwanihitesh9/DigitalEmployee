# Setup Checklist - Digital Employee with AI Analysis

## ✅ Prerequisites

- [ ] Node.js v14+ installed
- [ ] Gmail account (or other IMAP/SMTP email)
- [ ] OpenAI API account with credits

## 📦 Installation Steps

### 1. Install Dependencies
```bash
cd /Users/hiteshdhanwani/Documents/GitHub/DigitalEmployee
npm install
```

### 2. Configure Environment Variables

Create `.env` file from template:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password  # Generate at: https://myaccount.google.com/apppasswords
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_TLS=true

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Application Configuration
CHECK_INTERVAL=60000
LOG_LEVEL=info
SIMILARITY_THRESHOLD=0.6
START_DATE=2026-01-28  # Only process emails after this date

# OpenAI API Configuration (Required for Credit Card Analysis)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

### 3. Gmail Setup (if using Gmail)

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Digital Employee"
   - Copy the 16-character password
   - Paste into `.env` as `EMAIL_PASSWORD` (remove spaces)

3. **Enable IMAP**
   - Gmail Settings → Forwarding and POP/IMAP
   - Enable IMAP

### 4. OpenAI API Setup

1. **Get API Key**
   - Sign up at: https://platform.openai.com/signup
   - Go to: https://platform.openai.com/api-keys
   - Create new secret key
   - Copy and paste into `.env` as `OPENAI_API_KEY`

2. **Add Credits**
   - Go to: https://platform.openai.com/account/billing
   - Add payment method
   - Recommended: $10 minimum for testing

## 🧪 Testing

### Test 1: Basic Email Monitoring

1. Start the application:
   ```bash
   npm start
   ```

2. Send a test email to yourself with subject:
   ```
   DIGITAL EMPLOYEE : Test
   ```

3. Check logs:
   ```bash
   tail -f logs/combined.log
   ```

### Test 2: Credit Card Analysis

1. Ensure application is running

2. Send email to yourself:
   - **Subject**: `DIGITAL EMPLOYEE : Credit Card Statement Analysis`
   - **Attachment**: Use `sample-statement.csv` from project root

3. Wait 30-60 seconds

4. Check inbox for HTML analysis report

### Test 3: Error Handling

1. Send email without attachment:
   - **Subject**: `DIGITAL EMPLOYEE : Credit Card Statement Analysis`
   - **No attachment**
   
2. Should receive polite error message

## ✅ Verification Checklist

- [ ] Application starts without errors
- [ ] Connects to email successfully (check console output)
- [ ] Processes test email with correct subject prefix
- [ ] Ignores emails without `DIGITAL EMPLOYEE :` prefix
- [ ] Ignores emails before START_DATE
- [ ] Credit card analysis generates HTML report
- [ ] Logs are being written to `logs/` directory
- [ ] OpenAI API calls are successful

## 🐛 Common Issues

### Issue: "IMAP error: Application-specific password required"
**Solution**: Generate and use Gmail App Password (see step 3.2 above)

### Issue: "OPENAI_API_KEY is required"
**Solution**: Add valid OpenAI API key to `.env` file

### Issue: "No new unread emails found"
**Solution**: 
- Ensure START_DATE is set to current/past date
- Email subject must start with `DIGITAL EMPLOYEE :` exactly
- Email must be unread

### Issue: Charts not generating
**Solution**: 
- Ensure `chartjs-node-canvas` installed: `npm install`
- Check Node.js version (v14+ required)

### Issue: Statement parsing errors
**Solution**:
- Verify file format (CSV with headers, PDF with text, or plain TXT)
- Check file is properly attached to email
- Review logs for specific error details

## 📊 Monitor Performance

### Check Logs
```bash
# Real-time logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log

# Search for specific email
grep "email@example.com" logs/combined.log
```

### Monitor OpenAI Usage
- Visit: https://platform.openai.com/usage
- Each analysis costs ~$0.01-0.05 (GPT-4)

## 🎯 Next Steps

1. **Customize Action Mappings**
   - Edit `src/config/actionMapping.js`
   - Add your own patterns and methods

2. **Add New Actions**
   - Add handler in `src/actions/actionHandlers.js`
   - Map patterns in `actionMapping.js`

3. **Adjust Sensitivity**
   - Lower `SIMILARITY_THRESHOLD` for more lenient matching
   - Higher for stricter matching

4. **Production Deployment**
   - Use process manager: `pm2` or `forever`
   - Set up log rotation
   - Monitor API costs

## 📚 Documentation

- [README.md](../README.md) - Full documentation
- [CREDIT_CARD_ANALYSIS.md](CREDIT_CARD_ANALYSIS.md) - Credit card feature details
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick command reference

## ✨ Ready to Use!

Your Digital Employee is now configured and ready to:
- 📧 Monitor your email inbox
- 🤖 Process requests intelligently
- 📊 Analyze credit card statements with AI
- 💎 Recommend best UAE credit cards
- 📝 Log all activities

Run `npm start` and send your first email! 🚀
