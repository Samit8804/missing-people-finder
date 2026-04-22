# Render Backend Deploy Fix

## NPM Conflict Fixed:
- Changed backend/package.json cloudinary ^2.5.1 → ^1.41.3 (compatible with multer-storage-cloudinary@4)
- Regenerated package-lock.json
- [Next: Commit & push done]

**Now retry Render deploy:**
1. Render Dashboard → your service → Manual Deploy → Clear build cache & deploy
2. Build Command: `npm install` (no flag needed now)

Repo updated: https://github.com/Samit8804/missing-people-finder/commit/[new]

