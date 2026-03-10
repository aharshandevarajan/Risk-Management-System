# 🚀 QUICK START GUIDE

## ⚡ Get Started in 3 Steps

### 1️⃣ Clear AI Cache (Important!)
```bash
cd backend
npm run clear-ai-cache
```

### 2️⃣ Start Backend
```bash
npm run dev
```

### 3️⃣ Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

---

## 🔑 Login Credentials
- **Email**: `admin@risk.com`
- **Password**: `admin123`

---

## ✅ What's Fixed

✅ **AI Insights Now Personalized** - Each risk gets unique analysis
✅ **Routes Fixed** - All endpoints working correctly  
✅ **Gemini API Updated** - Using latest model (gemini-1.5-pro)
✅ **Smart Fallback** - Professional insights even without API

---

## 🧪 Test Everything

```bash
cd backend
npm run test
```

This checks:
- Environment variables ✅
- Database connection ✅
- AI functionality ✅
- Personalization ✅

---

## 🎯 How to See Personalized AI

1. Login to the app
2. Click any risk row
3. Click "AI Analysis" tab
4. Click "View Full AI Analysis"
5. See unique insights with:
   - Specific description references
   - Asset-tailored recommendations
   - Score-based priorities

---

## 🔄 Regenerate Insights

Click the **"🔄 Regenerate"** button in the AI modal to force fresh analysis.

---

## 📊 What Makes Insights Unique Now

Each insight includes:
- ✅ Actual risk description
- ✅ Specific affected asset
- ✅ Real risk score (0-25)
- ✅ Severity level
- ✅ Likelihood explanation
- ✅ Asset-specific mitigation steps

---

## 🛠️ Useful Commands

```bash
# Backend
npm run dev              # Start server
npm run test             # Test everything
npm run clear-ai-cache   # Clear cached insights
npm run seed             # Add sample data
npm run create-admin     # Create admin user

# Frontend
npm run dev              # Start UI
```

---

## 📁 Key Files Modified

- `backend/src/services/aiService.js` - Enhanced AI prompts & fallback
- `backend/src/routes/riskRoutes.js` - Fixed route order
- `backend/clearAICache.js` - New cache clearing script
- `backend/testProject.js` - New diagnostic test

---

## 🎉 You're All Set!

Your system now provides **unique, personalized AI insights** for every risk based on its specific details!
