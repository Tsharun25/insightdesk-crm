# InsightDesk CRM

InsightDesk CRM is a React + Vite sales dashboard with Express/MongoDB auth, database-backed leads/deals, and Vercel-ready API functions.

## Local Setup

```bash
npm install
npm run dev:full
```

Frontend:

```bash
http://localhost:5173
```

Backend health:

```bash
http://localhost:5000/api/health
```

## Environment Variables

Create or update `server/.env` for local development:

```bash
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-strong-secret
```

For Vercel, add these variables in Project Settings:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-strong-secret
```

If the backend is deployed separately from the frontend, also add this to the frontend project:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

## Vercel Deployment

This repo can be deployed as one Vercel project:

- Vite builds the frontend into `dist`
- `/api/health`, `/api/auth/*`, and `/api/crm/*` run as Vercel API functions
- SPA routing is handled by `vercel.json`

Recommended Vercel settings:

```bash
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Scripts

```bash
npm run dev       # frontend only
npm run server    # local Express API only
npm run dev:full  # frontend + backend
npm run build     # production build
```

## API Routes

```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/crm/leads
POST /api/crm/leads
GET  /api/crm/deals
POST /api/crm/deals
```
