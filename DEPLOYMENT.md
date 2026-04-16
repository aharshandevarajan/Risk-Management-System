# Deploy on Render + Vercel

This project should be deployed as:
- Backend API on Render (`backend`)
- Frontend app on Vercel (`frontend`)

## 1. Deploy Backend on Render

1. Push this repo to GitHub.
2. In Render, click `New +` -> `Blueprint` and select this repo.
3. Render will read `render.yaml` and create `risk-management-backend`.
4. In Render service env vars, set:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY` (optional if you do not use AI features)
5. Deploy and copy your backend URL, for example:
   - `https://risk-management-backend.onrender.com`
6. Test health endpoint:
   - `https://risk-management-backend.onrender.com/api/health`

## 2. Deploy Frontend on Vercel

1. In Vercel, import the same GitHub repo.
2. Keep project root as repository root (do not switch to `frontend` directory).
3. Vercel will use root `vercel.json` to build the frontend from `frontend`.
4. Add environment variable in Vercel:
   - `VITE_API_URL=https://<your-render-backend>.onrender.com/api`
5. Deploy.

## 3. Post-Deploy Checks

1. Open Vercel URL and login/register.
2. Confirm API calls succeed (no CORS/network errors in browser console).
3. Check backend logs in Render for incoming requests.

## Required Environment Variables

### Render (backend)
- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY` (optional)
- `PORT` is provided automatically by Render.

### Vercel (frontend)
- `VITE_API_URL` (must point to your Render backend `/api`)

## Notes

- Frontend fallback API path (`/_/backend/api`) is for local integrated setups. For production with Render backend, always set `VITE_API_URL`.
- If you change backend URL later, update `VITE_API_URL` in Vercel and redeploy.
