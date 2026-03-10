# Cybersecurity Risk Management – API Reference

Base URL: `http://localhost:5000/api`

---

## Auth (public)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{ name, email, password }` | Create account (role: Employee) |
| POST | `/auth/login` | `{ email, password }` | Get JWT token |

---

## Risks (require `Authorization: Bearer <token>`)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/risks` | - | List risks (query: `?severity=&status=&threatType=`) |
| GET | `/risks/summary` | - | Dashboard stats |
| GET | `/risks/export` | - | Download risks as CSV (Admin/Analyst) |
| GET | `/risks/:id` | - | Get single risk |
| POST | `/risks` | `{ description, threatType, affectedAsset, likelihood, impact }` | Create risk |
| POST | `/risks/import` | `multipart/form-data`, field `file` (CSV/Excel) | Bulk import (Admin/Analyst) |
| PUT | `/risks/:id` | `{ status?, description?, ... }` | Update risk |
| DELETE | `/risks/:id` | - | Delete risk (Admin only) |

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

---

## Validation rules

- **Auth**: `name` required, `email` valid, `password` min 6 chars
- **Create risk**: `description`, `threatType`, `affectedAsset`, `likelihood` (1–5), `impact` (1–5)
- **Update risk**: `status` one of Open, Investigating, Mitigated, Closed
