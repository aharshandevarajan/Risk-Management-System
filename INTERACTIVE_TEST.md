# 🧪 INTERACTIVE ELEMENTS TEST CHECKLIST

## Test All Buttons and Sliders

### ✅ LIKELIHOOD & IMPACT SLIDERS (RiskForm)

**Location**: Risk Management page → "Report New Risk" form

**Test Steps**:
1. Open browser DevTools (F12) → Console tab
2. Drag the Likelihood slider (1-5)
3. Check if:
   - ✅ Slider moves smoothly
   - ✅ Number badge updates (shows 1-5)
   - ✅ Risk Score updates (top right)
   - ✅ Severity color changes (High/Medium/Low)
   - ✅ Track fills with color as you drag

4. Drag the Impact slider (1-5)
5. Check if:
   - ✅ Slider moves smoothly
   - ✅ Number badge updates (shows 1-5)
   - ✅ Risk Score updates (top right)
   - ✅ Severity color changes

**Expected Behavior**:
- Likelihood × Impact = Risk Score
- Score ≥13 = High (red)
- Score 6-12 = Medium (amber)
- Score ≤5 = Low (green)

**If Not Working**:
```javascript
// Test in browser console (F12):
console.log('Testing sliders...');

// Check if React state is updating
// You should see the values change as you drag
```

---

## 🔘 ALL BUTTON TESTS

### 1. SEVERITY FILTER TOGGLES (RiskFilters)

**Location**: Risk Management page → Filters section

**Test**:
- [ ] Click "🔴 High" button
  - Should: Turn red gradient, scale up, show shadow
  - Table: Shows only High severity risks
- [ ] Click "🔴 High" again
  - Should: Deactivate, return to outline style
  - Table: Shows all risks
- [ ] Click "🟡 Medium" button
  - Should: Turn amber gradient
- [ ] Click "🟢 Low" button
  - Should: Turn green gradient
- [ ] Click "Clear all" button
  - Should: Reset all filters

---

### 2. SUBMIT RISK BUTTON (RiskForm)

**Location**: Risk Management page → "Report New Risk" form

**Test**:
- [ ] Fill all fields (Threat Type, Asset, Description)
- [ ] Click "Submit Risk" button
  - Should: Show "Submitting..." with spinner
  - Should: Create new risk
  - Should: Clear form after success
  - Should: Show new risk at top of table

---

### 3. STATUS DROPDOWN BUTTONS (RiskTable)

**Location**: Risk Management page → Risk table rows

**Test**:
- [ ] Click status dropdown on any risk
  - Should: Show options (Open, Investigating, Mitigated, Closed)
- [ ] Select different status
  - Should: Update immediately
  - Should: Change badge color

---

### 4. AI INSIGHT BUTTON (RiskTable)

**Location**: Risk Management page → Risk table → "🤖 AI" button

**Test**:
- [ ] Click "🤖 AI" button on any risk
  - Should: Open AI Insight modal
  - Should: Show loading spinner
  - Should: Display AI analysis
- [ ] Click "🔄 Regenerate" button
  - Should: Generate new insight
- [ ] Click "📄 Export" button
  - Should: Download text file

---

### 5. ARCHIVE BUTTON (RiskTable)

**Location**: Risk Management page → Risk table → "📦 Archive" button

**Test**:
- [ ] Click "📦 Archive" button
  - Should: Archive the risk
  - Should: Remove from main table
- [ ] Go to Archive page
  - Should: See archived risk
- [ ] Click "Restore" button
  - Should: Restore to main table

---

### 6. DELETE BUTTON (RiskTable)

**Location**: Risk Management page → Risk table → "🗑️ Delete" button

**Test**:
- [ ] Click "🗑️ Delete" button
  - Should: Show confirmation dialog
- [ ] Click "OK"
  - Should: Delete risk permanently
  - Should: Remove from table

---

### 7. ROW CLICK (RiskTable)

**Location**: Risk Management page → Click any table row

**Test**:
- [ ] Click on a risk row (not on buttons)
  - Should: Open Risk Detail Drawer from right
  - Should: Show 4 tabs (Overview, Technical, AI Analysis, Activity)
- [ ] Click tabs
  - Should: Switch between tabs
- [ ] Click "View Full AI Analysis"
  - Should: Open AI modal
- [ ] Click X or outside
  - Should: Close drawer

---

### 8. CSV OPERATIONS (CsvOperations)

**Location**: Risk Management page → CSV Import/Export section

**Test**:
- [ ] Click "📤 Export CSV" button
  - Should: Download CSV file with all risks
- [ ] Click "Choose File" for import
  - Should: Open file picker
- [ ] Select CSV/Excel file
- [ ] Click "📥 Import" button
  - Should: Upload and import risks
  - Should: Show success message

---

### 9. SIDEBAR NAVIGATION

**Location**: Left sidebar

**Test**:
- [ ] Click "Dashboard" link
  - Should: Navigate to dashboard
- [ ] Click "Risk Management" link
  - Should: Navigate to risks page
- [ ] Click "Archive" link
  - Should: Navigate to archive page
- [ ] Click "AI Insights" link
  - Should: Navigate to AI page
- [ ] Click "Logout" button
  - Should: Logout and redirect to login

---

### 10. TOPBAR BUTTONS

**Location**: Top bar

**Test**:
- [ ] Check live clock
  - Should: Update every second
- [ ] Check system status indicator
  - Should: Show "Operational" in green

---

## 🐛 DEBUGGING SLIDERS NOT WORKING

If sliders don't move or update:

### Check 1: Browser Console Errors
```
F12 → Console tab
Look for red errors
```

### Check 2: Test Slider Directly
```javascript
// In browser console (F12):
const slider = document.querySelector('.slider-likelihood');
console.log('Slider element:', slider);
console.log('Slider value:', slider?.value);

// Try changing value
if (slider) {
  slider.value = 5;
  slider.dispatchEvent(new Event('change', { bubbles: true }));
}
```

### Check 3: CSS Applied
```javascript
// In browser console:
const slider = document.querySelector('.slider-likelihood');
console.log('Computed styles:', window.getComputedStyle(slider));
```

### Check 4: React State
```javascript
// Add console.log in RiskForm.tsx update function:
const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
  console.log('Updating:', key, value); // ADD THIS
  setDraft((prev) => ({ ...prev, [key]: value }));
};
```

---

## 🔧 COMMON FIXES

### Sliders Not Moving:
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Check if CSS loaded: Look for colored slider track
4. Restart frontend: `npm run dev`

### Buttons Not Clicking:
1. Check z-index conflicts
2. Check pointer-events CSS
3. Look for overlapping elements
4. Check browser console for errors

### State Not Updating:
1. Check React DevTools
2. Look for console errors
3. Verify event handlers attached
4. Check network tab for API calls

---

## ✅ QUICK TEST SCRIPT

Run this in browser console (F12) after loading the page:

```javascript
console.log('🧪 Testing Interactive Elements...\n');

// Test 1: Check sliders exist
const likelihood = document.querySelector('.slider-likelihood');
const impact = document.querySelector('.slider-impact');
console.log('✅ Likelihood slider:', likelihood ? 'Found' : '❌ Not found');
console.log('✅ Impact slider:', impact ? 'Found' : '❌ Not found');

// Test 2: Check buttons exist
const submitBtn = document.querySelector('button[type="submit"]');
const aiButtons = document.querySelectorAll('button:has(svg)');
console.log('✅ Submit button:', submitBtn ? 'Found' : '❌ Not found');
console.log('✅ Action buttons:', aiButtons.length, 'found');

// Test 3: Check if sliders are interactive
if (likelihood) {
  console.log('✅ Likelihood value:', likelihood.value);
  console.log('✅ Likelihood min/max:', likelihood.min, '/', likelihood.max);
}
if (impact) {
  console.log('✅ Impact value:', impact.value);
  console.log('✅ Impact min/max:', impact.min, '/', impact.max);
}

console.log('\n✅ Test complete!');
```

---

## 📝 REPORT ISSUES

If any element doesn't work:
1. Note which element (slider, button, etc.)
2. Copy browser console errors
3. Note what happens vs what should happen
4. Check if it's a visual issue or functional issue
