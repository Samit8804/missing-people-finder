Frontend Environment Setup

- Use a local overrides file: frontend/.env.local. This is not committed and is ignored by Git by default.
- The key you typically override is NEXT_PUBLIC_API_URL to point to your backend API.

Example frontend/.env.local
```
NEXT_PUBLIC_API_URL=https://missing-people-finder-3.onrender.com/api
```

Deployment hints
- Vercel (frontend): set NEXT_PUBLIC_API_URL to the backend API URL you want the frontend to call (e.g., Render URL).
- Render (backend): ensure CORS_WHITELIST includes your frontend origin (e.g., https://missing-people-finder-vercel.vercel.app).

General notes
- After changing .env.local, restart the Next.js dev server to pick up new values.
- Do not commit .env.local; keep secrets out of version control.
