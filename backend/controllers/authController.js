const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendOTP = require('../utils/sendOTP');
const asyncHandler = require('../utils/asyncHandler');

// ─── @route  POST /api/auth/signup ────────────────────────────────────────────
// @desc    Register a new user
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    // Inform the user clearly that the email is already registered
    return res.status(409).json({ success: false, message: 'This email is already registered' });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone: phone || null,
    passwordHash: password,
  });

  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  // OTP delivery: User's phone (if provided) first, otherwise email
  // The frontend sends "preference": "sms" or "email" in the request body
  const preference = req.body.otpPreference;
  const canUseSMS = phone && phone.startsWith('+') && isSMSConfigured();
  
  // If user requested SMS but we can't use it, fall back to email
  let useSMS = preference === 'sms' && canUseSMS;
  let otpMethod = null;

  if (useSMS && canUseSMS) {
    try {
      otpMethod = await sendOTP({ to: phone, otp, name: user.name });
    } catch (smsErr) {
      console.warn('⚠️ SMS failed, falling back to email:', smsErr.message);
      useSMS = false;
    }
  }

  // Fall back to email if SMS not used or not available
  if (!useSMS) {
    try {
      otpMethod = await sendOTP({ to: user.email, otp, name: user.name });
    } catch (emailErr) {
      console.warn('⚠️ Email failed:', emailErr.message);
    }
  }

  res.status(201).json({
    success: true,
    message: user.phone && otpMethod?.method === 'sms'
      ? 'Account created! OTP sent to your phone. Verify to activate.'
      : 'Account created! OTP sent to your email. Verify to activate.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// ─── @route  POST /api/auth/login ─────────────────────────────────────────────
// @desc    Login + return JWT
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  // OTP verification is optional for login; allow password-based login for existing accounts

  const token = generateToken(user._id, user.role);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
    },
  });
});

// ─── @route  POST /api/auth/verify-otp ───────────────────────────────────────
// @access  Public (supports signup OTP flow without authentication) or Private (existing flow)
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;

  // If an authenticated user is verifying OTP (typical login flow with OTP), keep existing logic
  if (req.user && req.user._id) {
    const user = await User.findById(req.user._id).select('+otp +otpExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified' });
    if (!otp) return res.status(400).json({ success: false, message: 'OTP is required' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
    return;
  }

  // Signup OTP flow (no authentication yet)
  if (!otp || !email) return res.status(400).json({ success: false, message: 'OTP and email are required' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified' });
  if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
  if (user.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  // Issue a JWT token so frontend can immediately log in after OTP verification
  const token = generateToken(user._id, user.role);
  res.status(200).json({
    success: true,
    message: 'OTP verified. You are now logged in.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
    },
  });
});

// ─── @route  POST /api/auth/resend-otp ───────────────────────────────────────
// @access  Public or Private (supports signup flow without auth)
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  let user;
  if (req.user && req.user._id) {
    user = await User.findById(req.user._id).select('+otp +otpExpiry');
  } else if (email) {
    user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
  }

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.isVerified) return res.status(400).json({ success: false, message: 'Already verified' });

  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'Your FindLink verification code',
    html: `<p>Your OTP: <strong style="font-size:24px;color:#7C3AED;">${otp}</strong></p><p>Expires in 10 minutes.</p>`,
  });

  res.status(200).json({ success: true, message: 'OTP sent to your email.' });
});

// ─── @route  POST /api/auth/google-login ───────────────────────────────────
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body; // ID token from Google
  if (!token) return res.status(400).json({ success: false, message: 'Google token is required' });

  // Lazy import to avoid heavier dependencies when not used
  const { OAuth2Client } = require('google-auth-library');
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
  if (!CLIENT_ID) {
    return res.status(500).json({ success: false, message: 'Google client not configured' });
  }
  const client = new OAuth2Client(CLIENT_ID);
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
    payload = ticket.getPayload();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid Google token' });
  }

  const email = (payload && payload.email) ? payload.email.toLowerCase() : null;
  const name = payload.name || 'Google User';
  if (!email) {
    return res.status(400).json({ success: false, message: 'Could not identify email from Google token' });
  }

  let user = await User.findOne({ email }).select('+otp +otpExpiry');
  if (!user) {
    // Create new user with a random password (required by schema)
    const randomPass = require('crypto').randomBytes(16).toString('hex');
    user = await User.create({ name, email, passwordHash: randomPass, isVerified: true });
  }

  // Generate JWT for the user
  const jwt = generateToken(user._id, user.role);
  res.status(200).json({
    success: true,
    message: 'Google login successful',
    token: jwt,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
    },
  });
});

// ─── @route  POST /api/auth/forgot-password ──────────────────────────────────
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(200).json({ success: true, message: 'If that email exists, a reset code was sent.' });
  }

  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'FindLink Password Reset Code',
    html: `<p>Hi ${user.name},</p><p>Reset code: <strong style="font-size:24px;color:#7C3AED;">${otp}</strong></p><p>Expires in 10 minutes.</p>`,
  });

  res.status(200).json({ success: true, message: 'If that email exists, a reset code was sent.' });
});

// ─── @route  POST /api/auth/reset-password ───────────────────────────────────
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry +passwordHash');
  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.passwordHash = newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
});

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

// ─── @route  PUT /api/auth/update-profile ────────────────────────────────────
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (req.file) user.avatar = req.file.path;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar },
  });
});

module.exports = { signup, login, verifyOTP, resendOTP, forgotPassword, resetPassword, googleLogin, getMe, updateProfile };
