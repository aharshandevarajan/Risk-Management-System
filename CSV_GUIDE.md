# Risk Management System - CSV Integration Guide

## 🚀 New Features

### 1. **CSV Seed Data** 
Populate your database with demo risks for testing and demos.

**Location:** `backend/data/seed_risks.csv`

**Usage:**
```bash
cd backend
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing risks
- Import all risks from the CSV file
- Assign them to the first Admin user found

### 2. **CSV Import**
Bulk import risks from external sources (SOC logs, incident reports, etc.)

**How to use:**
1. Navigate to the **Risks** page
2. Click **Import CSV** button in the CSV Operations card
3. Select your CSV file
4. System validates and imports all valid rows

**CSV Format:**
```csv
description,affectedAsset,threatType,likelihood,impact,severity,status
Suspicious email detected,Employee Device,Phishing,4,3,Medium,Open
```

**Required columns:**
- `description` - Text description of the risk
- `affectedAsset` - Server, Database, Network, Employee Device, or Web App
- `threatType` - Phishing, Malware, Data Breach, Insider Threat, Weak Password, or Network Attack
- `likelihood` - Number 1-5
- `impact` - Number 1-5
- `severity` - Low, Medium, or High
- `status` - Open, Investigating, Mitigated, or Closed

### 3. **CSV Export**
Export all risks for reporting in Excel, Power BI, or other tools.

**How to use:**
1. Navigate to the **Risks** page
2. Click **Export CSV** button in the CSV Operations card
3. File downloads automatically as `risks-export-{timestamp}.csv`

**Export includes:**
- All risk fields
- Reporter email
- Calculated risk scores
- Current status

## 🎨 UI Overhaul

### New Design Features:
- **Gradient backgrounds** - Modern purple/indigo theme
- **Animated cards** - Hover effects and transitions
- **Better typography** - Bold, clear hierarchy
- **Enhanced badges** - Color-coded severity indicators
- **Improved spacing** - More breathing room
- **Loading states** - Smooth spinners
- **Empty states** - Helpful illustrations

### Color Scheme:
- **Primary:** Indigo → Purple gradients
- **Success:** Emerald → Teal
- **Warning:** Amber → Orange
- **Danger:** Red → Pink
- **Background:** Slate 950 → 900

## 📦 Installation

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Permissions

### CSV Import/Export:
- **Admin** ✅
- **Security Analyst** ✅
- **Employee** ❌

## 📝 Sample CSV Data

The seed file includes 10 realistic scenarios:
- Phishing campaigns
- Ransomware attacks
- Data breach attempts
- Insider threats
- Weak passwords
- Network attacks
- SQL injection
- DDoS attacks

## 🛠️ Technical Stack

**Backend:**
- Express.js
- MongoDB + Mongoose
- Multer (file uploads)
- csv-parser (CSV parsing)

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Axios
- Vite

## 🎯 Use Cases

1. **Demo/Testing:** Use `npm run seed` to populate dashboard instantly
2. **Bulk Import:** Import incident logs from SIEM tools
3. **Reporting:** Export to Excel for executive reports
4. **Data Migration:** Move risks between environments
5. **Backup:** Regular CSV exports for data backup

## 🚨 Error Handling

- Invalid CSV format → Clear error message
- Missing required fields → Row skipped
- File too large (>2MB) → Upload rejected
- Unauthorized access → 403 Forbidden

## 📊 Dashboard Metrics

- Total Risks
- Open Risks
- Closed Risks
- High Severity Alerts
- Severity Distribution Chart
- Status Distribution Chart
- Recent Incidents List

## 🔄 Workflow

1. **Seed** → Populate demo data
2. **Import** → Add external risks
3. **Monitor** → View dashboard
4. **Triage** → Update statuses
5. **Export** → Generate reports

---

**Built with ❤️ for Security Teams**
