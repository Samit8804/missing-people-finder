const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  googleLogin,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ─── Protected Routes (require JWT) ────────────────────────────────────────────
// OTP verification can be performed both when authenticated (existing flow) and when signing up (unauthenticated)
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
// Google login / signup
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;
