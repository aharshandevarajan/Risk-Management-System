# 🚀 PROJECT STARTUP & TROUBLESHOOTING GUIDE

## ✅ FIXED ISSUES

### 1. Route Conflict Fixed
- **Problem**: Routes like `/:id/ai-insight` were conflicting with `/:id`
- **Solution**: Reordered routes so specific paths come before generic `:id` routes

### 2. AI Personalization Enhanced
- **Problem**: AI insights were generic and same for all risks
- **Solution**: Updated AI prompts to include specific description, asset, score, and severity
- **Result**: Each risk now gets unique, tailored insights

### 3. AI Cache Management
- **Problem**: Old cached insights showing generic responses
- **Solution**: Added `clearAICache.js` script to clear cached insights

---

## 🏃 QUICK START

### Backend Setup
```bash
cd backend

# Install dependencies (if not done)
npm install

# Test the project
npm run test

# Clear old AI cache (IMPORTANT!)
npm run clear-ai-cache

# Start the server
npm run dev
```

### Frontend Setup
```bash
cd frontend

# Install dependencies (if not done)
npm install

# Start the dev server
npm run dev
```

---

## 🧪 TESTING AI FUNCTIONALITY

### Step 1: Run Diagnostic Test
```bash
cd backend
npm run test
```

This will check:
- ✅ Environment variables
- ✅ Database connection
- ✅ AI service functionality
- ✅ Personalization of insights

### Step 2: Clear AI Cache
```bash
npm run clear-ai-cache
```

### Step 3: Test in Browser
1. Login with: `admin@risk.com` / `admin123`
2. Click on any risk row to open details
3. Click "AI Analysis" tab
4. Click "View Full AI Analysis"
5. Verify the insight mentions:
   - Specific description text
   - Specific asset name
   - Actual risk score
   - Severity level

### Step 4: Test Regeneration
- Click "🔄 Regenerate" button
- New insight should be generated with fresh data

---

## 🔧 TROUBLESHOOTING

### Issue: AI insights are still generic

**Solution:**
```bash
cd backend
npm run clear-ai-cache
# Then restart server
npm run dev
```

### Issue: "Invalid API key" error

**Check:**
1. `.env` file has `GEMINI_API_KEY=AIzaSyD3FSl4jAj95PvZb6X2lmFJ4gxy0hjOmMU`
2. Key is 39 characters long
3. No extra spaces or quotes

**Test:**
```bash
node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY)"
```

### Issue: Routes not working (404 errors)

**Fixed!** Routes are now properly ordered:
1. Static routes first (`/ai/trends`, `/summary`, `/export`)
2. Specific ID routes (`/:id/ai-insight`, `/:id/archive`)
3. Generic ID routes last (`/:id`)

### Issue: Database connection failed

**Check:**
1. MongoDB is running: `mongod` or MongoDB service
2. Connection string in `.env`: `mongodb://localhost:27017/cyber_risk_db`

**Test:**
```bash
mongo
use cyber_risk_db
db.risks.count()
```

### Issue: No risks in database

**Solution:**
```bash
npm run seed
```

---

## 📊 AVAILABLE SCRIPTS

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run test` - Run diagnostic test
- `npm run seed` - Populate database with sample risks
- `npm run create-admin` - Create admin user
- `npm run clear-risks` - Delete all risks
- `npm run clear-ai-cache` - Clear cached AI insights

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🎯 AI INSIGHT FEATURES

### What Makes Insights Unique Now:

1. **Description-Based Analysis**
   - AI reads the actual risk description
   - Provides specific recommendations based on the incident

2. **Asset-Specific Guidance**
   - Mitigation steps tailored to the affected asset
   - Team assignments based on asset type

3. **Score-Based Prioritization**
   - Critical priority for scores ≥15
   - High priority for scores ≥9
   - Timeline based on actual severity

4. **Impact-Level Assessment**
   - Financial estimates based on impact score
   - Severe/Significant/Moderate classifications

### Example Output:
```
Summary: "High severity Phishing affecting Email Server (Risk Score: 20/25). 
The incident 'Suspicious email with malicious attachment sent to finance team' 
poses severe risk with 4/5 likelihood requiring immediate attention."

Root Cause: "Email-based attack targeting Email Server. The description 
'Suspicious email with malicious attachment sent to finance team' indicates 
social engineering tactics exploiting user trust..."

Mitigation:
1. Implement advanced email filtering for Email Server
2. Deploy anti-phishing tools with URL scanning
3. Conduct targeted security training for Email Server users
4. Enable DMARC/SPF/DKIM authentication
5. Set up incident response for phishing attempts on Email Server
```

---

## 🔐 DEFAULT CREDENTIALS

- **Email**: admin@risk.com
- **Password**: admin123
- **Role**: Admin (full access)

---

## 📝 NOTES

- AI insights are cached for 24 hours
- Use "Regenerate" button to force fresh insights
- Gemini API has rate limits (check Google AI Studio)
- Fallback responses used if API fails
- All insights are stored in database for offline access

---

## 🆘 STILL HAVING ISSUES?

Run the diagnostic test:
```bash
cd backend
npm run test
```

This will show exactly what's working and what needs attention.
