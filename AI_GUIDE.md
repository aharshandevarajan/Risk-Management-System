# 🤖 AI Integration Guide

## Features Added

### 1. AI Risk Analysis
- Automatic AI analysis when creating risks
- Severity assessment
- Mitigation recommendations
- Impact analysis
- Time to resolve estimation
- AI confidence score

### 2. AI Trend Prediction
- Analyzes historical risk data
- Predicts future trends
- Identifies vulnerable areas
- Provides recommendations

### 3. AI Executive Reports
- Auto-generated summaries
- Professional 2-paragraph reports
- Key metrics and insights

## Setup

### 1. Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

### 2. Add to .env
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart Backend
```bash
cd backend
npm run dev
```

## API Endpoints

```
GET  /api/risks/ai/trends      # Get AI trend analysis
GET  /api/risks/ai/report      # Get AI executive report
GET  /api/risks/:id/analyze    # Analyze specific risk
POST /api/risks                # Auto-analyzes with AI
```

## Frontend Components

### AIInsights Component
- Displays AI trends
- Shows executive report
- Predictions and recommendations

### AI Page
- New route: `/ai`
- Accessible from sidebar
- Real-time AI insights

## How It Works

### Risk Creation Flow
1. User submits risk
2. Risk saved to database
3. AI analyzes risk automatically
4. AI analysis saved to risk document
5. Response includes AI insights

### AI Analysis
```javascript
{
  severity: "High",
  mitigation: [
    "Isolate affected systems",
    "Run security scan",
    "Update firewall rules"
  ],
  impact: "Critical data exposure risk",
  timeToResolve: "24-48 hours",
  aiConfidence: 92
}
```

### Trend Prediction
```javascript
{
  trend: "Increasing",
  vulnerableAreas: ["Employee Devices", "Network"],
  predictions: [
    "Phishing attacks likely to increase",
    "Network vulnerabilities need attention"
  ],
  recommendations: [
    "Implement MFA",
    "Conduct security training"
  ]
}
```

## Tech Stack

- **AI Model**: Google Gemini Pro
- **Backend**: Node.js + Express
- **Frontend**: React + TypeScript
- **Integration**: @google/generative-ai

## Usage

### View AI Insights
1. Navigate to "AI Insights" in sidebar
2. View executive report
3. Check trend analysis
4. Review predictions

### Create Risk with AI
1. Go to Risks page
2. Submit new risk
3. AI automatically analyzes
4. View AI recommendations

## Benefits

✅ Automated risk assessment
✅ Predictive analytics
✅ Smart recommendations
✅ Executive summaries
✅ Trend identification
✅ Time-saving automation

## Cost

- Gemini API: Free tier available
- 60 requests per minute
- Sufficient for most use cases

## Customization

Edit `backend/src/services/aiService.js` to:
- Change AI prompts
- Adjust analysis depth
- Modify response format
- Add new AI features

---

**Your Risk Management System now has AI superpowers! 🚀**
