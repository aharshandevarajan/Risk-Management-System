# 🔍 MANUAL RISK CREATION - ERROR CHECKING GUIDE

## ✅ Backend Test Results

**Status**: ✅ ALL TESTS PASSED

The backend is working perfectly:
- ✅ Risk creation endpoint functional
- ✅ Validation working correctly
- ✅ All required fields validated
- ✅ Risk score calculation working
- ✅ Severity assignment working

---

## 🧪 How to Test Manual Risk Creation

### Step 1: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 2: Login
- Open browser: http://localhost:5173
- Email: `admin@risk.com`
- Password: `admin123`

### Step 3: Navigate to Risk Management
- Click "Risk Management" in sidebar
- You should see the "Report New Risk" form

### Step 4: Fill Out Form
1. **Threat Type**: Select any (e.g., "Phishing")
2. **Affected Asset**: Select any (e.g., "Employee Device")
3. **Description**: Type something (e.g., "Test risk entry")
4. **Likelihood**: Adjust slider (1-5)
5. **Impact**: Adjust slider (1-5)
6. Click **"Submit Risk"** button

### Step 5: Check Results
- ✅ Form should clear after submission
- ✅ New risk should appear at top of table
- ✅ No error messages should appear

---

## 🐛 Common Errors & Solutions

### Error 1: "Failed to create risk" or 401 Unauthorized

**Cause**: Token expired or not set

**Solution**:
1. Logout and login again
2. Check browser console for token
3. Verify backend is running on port 5000

**Test Token:**
```javascript
// In browser console (F12)
console.log(localStorage.getItem('cyber-risk-token'));
```

### Error 2: "Please fill out all fields"

**Cause**: Missing required fields

**Solution**:
- Ensure Threat Type is selected
- Ensure Affected Asset is selected
- Ensure Description is not empty

### Error 3: Network Error / Cannot connect

**Cause**: Backend not running or wrong port

**Solution**:
```bash
# Check backend is running
cd backend
npm run dev

# Should see: "Server listening on port 5000"
```

### Error 4: Form submits but risk doesn't appear

**Cause**: Frontend not refreshing or API response issue

**Solution**:
1. Refresh the page manually
2. Check browser console (F12) for errors
3. Check Network tab for API response

---

## 🔧 Debugging Steps

### 1. Check Backend Logs
When you submit the form, backend should show:
```
POST /api/risks 201
```

### 2. Check Browser Console (F12)
Look for:
- ❌ Red errors
- ⚠️ Yellow warnings
- Network request status

### 3. Check Network Tab (F12)
- Click "Network" tab
- Submit form
- Look for POST request to `/api/risks`
- Status should be `201 Created`
- Response should contain the new risk object

### 4. Verify API Endpoint
Test directly with curl:
```bash
# Get your token first (from browser console)
TOKEN="your-token-here"

# Test create risk
curl -X POST http://localhost:5000/api/risks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "threatType": "Phishing",
    "affectedAsset": "Server",
    "description": "Test risk from curl",
    "likelihood": 3,
    "impact": 4
  }'
```

---

## 📊 Expected Behavior

### When Form is Submitted:

1. **Button Changes**: "Submit Risk" → "Submitting..." (with spinner)
2. **API Call**: POST to `/api/risks` with form data
3. **Response**: 201 status with new risk object
4. **Form Clears**: All fields reset to defaults
5. **Table Updates**: New risk appears at top
6. **No Errors**: No red error messages

### Risk Score Calculation:
- **Formula**: Likelihood × Impact
- **Severity**:
  - High: Score ≥ 13
  - Medium: Score 6-12
  - Low: Score ≤ 5

---

## 🎯 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Logged in as admin
- [ ] Can see "Report New Risk" form
- [ ] All dropdowns have options
- [ ] Sliders work (1-5)
- [ ] Risk score updates as you adjust sliders
- [ ] Severity color changes (red/amber/green)
- [ ] Submit button is clickable
- [ ] Form submits without errors
- [ ] New risk appears in table
- [ ] Form clears after submission

---

## 🆘 Still Having Issues?

### Run Full Diagnostic:
```bash
cd backend
npm run test
```

### Check Specific Endpoint:
```bash
# Test if backend is responding
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Cyber Risk API is running"}
```

### Check Database:
```bash
# In MongoDB shell
mongo
use cyber_risk_db
db.risks.find().limit(1).pretty()
```

### Frontend Environment:
Check `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 Manual Test Script

Copy this into browser console (F12) after logging in:

```javascript
// Test manual risk creation
const testRisk = {
  threatType: 'Phishing',
  affectedAsset: 'Employee Device',
  description: 'Console test risk - please delete',
  likelihood: 3,
  impact: 4
};

fetch('http://localhost:5000/api/risks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('cyber-risk-token')}`
  },
  body: JSON.stringify(testRisk)
})
.then(res => res.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

If this works, the issue is in the form component.
If this fails, the issue is in the backend or authentication.

---

## ✅ Confirmation

Backend tests show everything is working correctly. If you're experiencing issues:

1. **Check browser console** for JavaScript errors
2. **Check network tab** for failed API calls
3. **Verify you're logged in** as admin
4. **Ensure both servers are running**
5. **Try the console test script** above

The system is fully functional - any issues are likely related to:
- Frontend/backend not running
- Authentication token expired
- Browser cache issues (try Ctrl+Shift+R to hard refresh)
