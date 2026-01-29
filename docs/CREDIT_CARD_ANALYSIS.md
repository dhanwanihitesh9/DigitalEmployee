# Credit Card Statement Analysis Feature

## Overview

The Digital Employee now includes an AI-powered credit card statement analysis feature that automatically processes credit card statements and generates comprehensive spending reports with UAE-specific credit card recommendations.

## How It Works

1. **Email Reception**: Send an email with subject starting with `DIGITAL EMPLOYEE :` containing keywords like "credit card", "statement", or "evaluation"
2. **Attachment Processing**: Attach your credit card statement (CSV, PDF, or TXT format)
3. **AI Analysis**: OpenAI GPT-4 analyzes your spending patterns
4. **Report Generation**: Receive a beautiful HTML email with:
   - Spending breakdown pie chart
   - Category-wise spending table
   - Most frequent transactions
   - Top spending categories
   - Spending analysis insights
   - UAE credit card recommendations

## Usage Example

### Send Email

**To**: Your configured Digital Employee email  
**Subject**: `DIGITAL EMPLOYEE : Credit Card Statement Analysis`  
**Body**: Any text (optional)  
**Attachment**: Your credit card statement file

### Supported File Formats

#### 1. CSV Format
```csv
Date,Merchant,Category,Amount,Currency
2026-01-15,Carrefour,Groceries,450.50,AED
2026-01-16,Emirates Petrol,Fuel,280.00,AED
```

**Required Columns** (flexible names):
- Date/Transaction Date
- Merchant/Description/Vendor
- Category/Type (optional - will be auto-categorized if missing)
- Amount/Value
- Currency (optional)

#### 2. PDF Format
Any credit card statement PDF from UAE banks (Emirates NBD, ADCB, FAB, Mashreq, etc.)

#### 3. TXT Format
Plain text transaction list with dates, merchants, and amounts

## Sample Output

The HTML email report includes:

### 📊 Visual Analytics
- **Pie Chart**: Interactive spending breakdown by category
- **Summary Cards**: Total spend and average transaction amount

### 💳 Spending Details
- **Category Table**: Complete breakdown with amounts, percentages, and transaction counts
- **Top Categories**: Ranked list of highest spending areas
- **Frequent Transactions**: Most visited merchants with totals

### 📈 AI Insights
- Spending pattern analysis
- Budget recommendations
- Behavioral insights

### 💎 UAE Credit Card Recommendations
Personalized suggestions from:
- Emirates NBD (Skywards, Mastercard Titanium)
- ADCB (Traveller, Touchpoints)
- First Abu Dhabi Bank (FAB) (Infinite, Signature)
- Mashreq (Platinum, NEO)
- Dubai Islamic Bank (Infinite, Prime)
- RAKBANK (Red, World Black)

Each recommendation includes:
- Card name and issuing bank
- Annual fee
- Cashback/rewards rate
- Key benefits matching your spending

## Testing

A sample statement file is included: [sample-statement.csv](../sample-statement.csv)

To test:
1. Start the Digital Employee: `npm start`
2. Send an email with subject: `DIGITAL EMPLOYEE : Please analyze my credit card statement`
3. Attach the `sample-statement.csv` file
4. Wait for the analysis report (usually 30-60 seconds)

## Configuration

### OpenAI API Key

Required in `.env`:
```env
OPENAI_API_KEY=sk-proj-your-key-here
```

### Model Selection

Currently uses: `gpt-4-turbo-preview`

To change the model, edit `src/services/openaiService.js`:
```javascript
model: "gpt-4-turbo-preview", // or "gpt-3.5-turbo" for faster/cheaper
```

### Chart Customization

Chart settings in `src/services/chartService.js`:
- Width: 800px
- Height: 600px
- Colors: Automatically generated for categories

## Troubleshooting

### No attachment error
**Issue**: Email sent without attachment  
**Solution**: Ensure statement file is properly attached

### Unsupported format error
**Issue**: File format not recognized  
**Solution**: Convert to CSV, PDF, or TXT format

### OpenAI API error
**Issue**: Invalid API key or rate limit  
**Solution**: Verify API key in `.env` and check OpenAI account status

### Poor analysis quality
**Issue**: Incorrect categorization or recommendations  
**Solution**: 
- Ensure CSV has clear merchant names
- Add category column if available
- Use detailed transaction descriptions

## Cost Considerations

- **OpenAI API**: ~$0.01-0.05 per analysis (GPT-4)
- **Email**: Free (using your email account)
- **Processing**: Local (no additional costs)

## Privacy & Security

- Statements are processed temporarily (not stored)
- Data sent to OpenAI for analysis only
- No transaction data is logged permanently
- SSL/TLS encryption for email transmission

## Limitations

- Maximum file size: ~10MB (email attachment limit)
- Processing time: 30-90 seconds depending on statement size
- Requires valid OpenAI API key
- Only emails after START_DATE are processed

## Future Enhancements

Planned features:
- [ ] Multiple currency support with conversion
- [ ] Budget tracking across months
- [ ] Expense trends over time
- [ ] Custom spending alerts
- [ ] Multi-statement comparison
- [ ] Export to Excel/PDF

## Support

For issues or questions:
1. Check logs in `logs/combined.log`
2. Verify OpenAI API key is valid
3. Ensure email has correct subject prefix: `DIGITAL EMPLOYEE :`
4. Test with provided sample file first
