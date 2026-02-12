# 🚀 Quick Reference Card

## Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run seed         # Seed demo data

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
```

## CSV Operations

### Seed
```bash
npm run seed
```
Populates database with 10 demo risks

### Import
1. Go to Risks page
2. Click "Import CSV"
3. Select file (max 2MB)

### Export
1. Go to Risks page
2. Click "Export CSV"
3. File downloads automatically

## CSV Format

```csv
description,affectedAsset,threatType,likelihood,impact,severity,status
Text here,Server,Phishing,4,3,Medium,Open
```

## Design Classes

### Buttons
```tsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-success">Success</button>
<button className="btn-danger">Danger</button>
```

### Badges
```tsx
<span className="badge badge-high">High</span>
<span className="badge badge-medium">Medium</span>
<span className="badge badge-low">Low</span>
```

### Cards
```tsx
<div className="card">
  <h2 className="card-title">Title</h2>
  <p className="card-value">42</p>
</div>
```

### Gradient Text
```tsx
<h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
  Title
</h1>
```

## Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Indigo | #6366f1 | Primary |
| Purple | #a855f7 | Primary |
| Emerald | #10b981 | Success |
| Amber | #f59e0b | Warning |
| Red | #ef4444 | Danger |
| Slate 950 | #020617 | Background |

## File Structure

```
backend/
├── data/seed_risks.csv    # Demo data
├── seed.js                # Seed script
└── src/
    ├── controllers/riskController.js  # CSV endpoints
    └── routes/riskRoutes.js          # CSV routes

frontend/src/
├── components/
│   ├── risks/CsvOperations.tsx       # CSV UI
│   ├── layout/                       # Layout components
│   └── charts/                       # Chart components
├── pages/
│   ├── DashboardPage.tsx             # Dashboard
│   └── RisksPage.tsx                 # Risks page
└── index.css                         # Design system
```

## Permissions

| Action | Admin | Analyst | Employee |
|--------|-------|---------|----------|
| View | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ |
| Update Own | ✅ | ✅ | ✅ |
| Update Any | ✅ | ✅ | ❌ |
| Delete | ✅ | ❌ | ❌ |
| Import CSV | ✅ | ✅ | ❌ |
| Export CSV | ✅ | ✅ | ❌ |

## API Endpoints

```
POST   /api/risks/import    # Import CSV
GET    /api/risks/export    # Export CSV
GET    /api/risks           # List risks
POST   /api/risks           # Create risk
PUT    /api/risks/:id       # Update risk
DELETE /api/risks/:id       # Delete risk
GET    /api/risks/summary   # Dashboard stats
```

## Component Props

### CsvOperations
```tsx
<CsvOperations onImportSuccess={() => fetchRisks()} />
```

### RiskForm
```tsx
<RiskForm onCreated={(risk) => setRisks([risk, ...risks])} />
```

### RiskTable
```tsx
<RiskTable
  risks={risks}
  loading={loading}
  onStatusChange={handleStatusChange}
  onDelete={handleDelete}
/>
```

### RiskFilters
```tsx
<RiskFilters
  filters={filters}
  onChange={setFilters}
/>
```

## Troubleshooting

### Seed fails
- Ensure MongoDB is running
- Create Admin user first

### Import fails
- Check CSV format
- File must be under 2MB
- Need Admin/Analyst role

### Charts not showing
- Run `npm run seed`
- Check if risks exist

### Styles not applying
- Restart dev server
- Clear browser cache

## Quick Tips

1. **Demo Data**: Run `npm run seed` first
2. **CSV Format**: Match headers exactly
3. **Permissions**: Admin/Analyst for CSV ops
4. **File Size**: Max 2MB for imports
5. **Gradients**: Use `bg-gradient-to-r` classes
6. **Animations**: Add `transition-all` for smooth effects
7. **Loading**: Use spinner SVG for loading states
8. **Empty States**: Add helpful icons and messages

## Documentation

- `CSV_GUIDE.md` - CSV features guide
- `QUICKSTART.md` - Getting started
- `SUMMARY.md` - Complete overview
- `DESIGN_SYSTEM.md` - Design reference
- `IMPLEMENTATION.md` - Full checklist

---

**Keep this card handy for quick reference!** 📋
