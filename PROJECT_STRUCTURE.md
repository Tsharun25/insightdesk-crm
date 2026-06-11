# InsightDesk CRM Project Structure

## Client files

Frontend React application files are here:

- `src/App.jsx` - main routes and page UI
- `src/main.jsx` - React app entry point
- `src/index.css` - global styles
- `src/components/` - reusable dashboard components
- `src/data/` - mock CRM/dashboard data
- `src/services/api.js` - frontend API helper for server requests
- `index.html` - HTML shell and SEO meta tags
- `vite.config.js` - Vite build config

Run client only:

```bash
npm run dev
```

Client URL:

```bash
http://127.0.0.1:5173
```

## Server files

Backend Express API files are here:

- `server/index.js` - Express server entry point
- `server/config/db.js` - MongoDB connection
- `server/models/User.js` - user schema
- `server/routes/authRoutes.js` - login/register APIs
- `server/.env` - local environment values
- `server/.env.example` - safe example env file

Run server only:

```bash
npm run server
```

Server URL:

```bash
http://localhost:5000
```

Health check:

```bash
http://localhost:5000/api/health
```

## Run full project

This starts both frontend and backend:

```bash
npm run dev:full
```

## Best GitHub and Vercel setup

Use **one GitHub repository** for this project.

That is the better choice because:

- frontend and backend stay in sync
- one commit updates the whole product
- easier to manage branches, issues, and history
- cleaner for portfolio and client handoff

For Vercel, the best setup is:

1. Create one Vercel project for the frontend using the repo root
2. Create a second Vercel project for the backend using the `server` folder as the Root Directory

That gives you one GitHub repo, but two deploy targets.

If you want only the frontend on Vercel, keep the backend local or move it to another host later.

### Vercel environment variables

Frontend project:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

Backend project:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret
CLIENT_URL=https://your-frontend-domain.vercel.app
```

## MongoDB connection

MongoDB connection is configured in:

```bash
server/.env
```

For now this project can run without MongoDB. If `MONGODB_URI` is empty, the
server starts in temporary memory auth mode. Register/Login works, but users are
lost when the server restarts.

When you are ready to connect the real database, set:

```bash
MONGODB_URI=your-mongodb-connection-string
```

Local MongoDB example:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/insightdesk-crm
```

MongoDB Atlas example:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster-name.mongodb.net/insightdesk-crm
```

## Auth routes

Register:

```bash
POST http://localhost:5000/api/auth/register
```

Login:

```bash
POST http://localhost:5000/api/auth/login
```
