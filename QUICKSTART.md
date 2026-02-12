# 🚀 Quick Start Guide

## Setup & Run

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Demo Data
```bash
cd backend
npm run seed
```

## 🎨 What's New

### Complete UI Overhaul
- **Modern gradient design** with purple/indigo theme
- **Smooth animations** and hover effects
- **Better visual hierarchy** with bold typography
- **Enhanced color coding** for severity levels
- **Improved spacing** and card layouts

### CSV Features

#### 1. Seed Data (`npm run seed`)
- Populates database with 10 realistic risk scenarios
- Perfect for demos and testing
- Clears existing data first

#### 2. Import CSV
- Bulk import risks from external sources
- Validates all rows before importing
- Shows success/error messages
- Max file size: 2MB

#### 3. Export CSV
- Download all risks as CSV
- Includes all fields + reporter email
- Timestamped filename
- Ready for Excel/Power BI

## 📋 CSV Format

```csv
description,affectedAsset,threatType,likelihood,impact,severity,status
Phishing email detected,Employee Device,Phishing,4,3,Medium,Open
```

### Fields:
- **description** - Risk description (required)
- **affectedAsset** - Server | Database | Network | Employee Device | Web App
- **threatType** - Phishing | Malware | Data Breach | Insider Threat | Weak Password | Network Attack
- **likelihood** - 1 to 5
- **impact** - 1 to 5
- **severity** - Low | Medium | High
- **status** - Open | Investigating | Mitigated | Closed

## 🎯 Key Features

### Dashboard
- 4 metric cards with gradients
- Severity distribution pie chart
- Status overview bar chart
- Recent incidents list

### Risks Page
- CSV import/export operations
- Advanced filters (severity, status, threat type)
- Risk submission form with live score calculation
- Interactive risk table with status updates

### Design System
- **Cards**: Gradient backgrounds with blur effects
- **Buttons**: 
  - Primary (indigo→purple)
  - Secondary (slate)
  - Success (emerald→teal)
  - Danger (red→pink)
- **Badges**: Color-coded severity indicators
- **Inputs**: Modern rounded with focus states

## 🔐 Permissions

| Feature | Admin | Analyst | Employee |
|---------|-------|---------|----------|
| View Dashboard | ✅ | ✅ | ✅ |
| Create Risk | ✅ | ✅ | ✅ |
| Update Own Risk | ✅ | ✅ | ✅ |
| Update Any Risk | ✅ | ✅ | ❌ |
| Delete Risk | ✅ | ❌ | ❌ |
| Import CSV | ✅ | ✅ | ❌ |
| Export CSV | ✅ | ✅ | ❌ |

## 🎨 Color Palette

- **Primary**: `#6366f1` (Indigo) → `#a855f7` (Purple)
- **Success**: `#10b981` (Emerald) → `#14b8a6` (Teal)
- **Warning**: `#f59e0b` (Amber) → `#f97316` (Orange)
- **Danger**: `#ef4444` (Red) → `#ec4899` (Pink)
- **Background**: `#020617` (Slate 950) → `#0f172a` (Slate 900)

## 📦 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- csv-parser

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Axios

## 🐛 Troubleshooting

### Seed fails
- Ensure MongoDB is running
- Create an Admin user first via registration

### Import fails
- Check CSV format matches exactly
- Ensure file is under 2MB
- Verify you have Admin/Analyst role

### Charts not showing
- Check if risks exist in database
- Run `npm run seed` to populate data

## 📸 Screenshots

The new UI features:
- Gradient card backgrounds
- Animated hover states
- Modern typography
- Color-coded badges
- Smooth transitions
- Loading spinners
- Empty state illustrations

---

**Enjoy the new Risk Management System! 🎉**
