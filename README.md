# FindLink — Missing Persons Platform

FindLink is a modern, semantic web application built to connect missing person reports with found individuals rapidly and securely. Uses a custom string and geolocation matching engine.

## 🚀 Complete Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary & Multer
- **Emails**: Nodemailer

---

## 💻 How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL
- Cloudinary Account (Free tier)
- Gmail account (For Nodemailer)

### 2. Backend Setup
1. CD into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `backend/.env`:
   ```bash
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0...
   JWT_SECRET=super_secret_key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   # Nodemailer
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM="FindLink <noreply@findlink.com>"
   CLIENT_URL=http://localhost:3000
   ```
4. Start the server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### 3. Frontend Setup
1. Open a new terminal and CD into the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run the frontend:
   ```bash
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

---

## 🌍 Deployment Guide

### Deploying the Backend (Render / Heroku)
1. Push your code to GitHub.
2. Go to **Render.com** and create a new **Web Service**.
3. Connect your GitHub repo and select the `backend` folder as the Root Directory.
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add all your `.env` variables into Render's Environment Variables section.
7. Click Deploy!

### Deploying the Frontend (Vercel)
1. Go to **Vercel.com** and import your GitHub repo.
2. Set the Root Directory to `frontend`.
3. Vercel will automatically detect Next.js and apply the correct build settings.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL = <YOUR_RENDER_BACKEND_URL>/api`
5. Click **Deploy**.

## 🛡️ Admin Access
To access the `/admin` panel, simply change a user's `role` from `"user"` to `"admin"` in your MongoDB Atlas Dashboard manually.

---
Built with ❤️ for a safer community.
