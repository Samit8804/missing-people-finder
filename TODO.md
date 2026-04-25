# TODO - Fix Sign-in CORS Issue

## Problem

Sign-in/sign-up shows "Something went wrong" due to CORS policy blocking requests from Vercel frontend to Render backend.

## Fix Plan

- [x] 0. Update CORS configuration in `backend/server.js`:
  - Reflect origin dynamically and enable credentials
  - Add explicit preflight handling for OPTIONS
- [ ] 1. Add origin whitelist via environment variable (CORS_WHITELIST) and update backend to use it
- [ ] 2. Improve error handling in `frontend/src/app/(auth)/login/page.js` to detect network/CORS errors
- [ ] 3. Improve error handling in `frontend/src/app/(auth)/signup/page.js` to detect network/CORS errors

## Follow-up

- Commit and push backend changes
- Redeploy backend on Render
- Test sign-in/sign-up again
