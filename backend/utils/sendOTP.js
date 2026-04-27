const nodemailer = require('nodemailer');
const { sendSMS, isSMSConfigured } = require('../utils/sendSMS');

// Create reusable transporter for email
let emailTransporter = null;
if (process.env.EMAIL_HOST) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send OTP - tries SMS first, falls back to email
 * @param {object} options - { to (email or phone), otp, name }
 */
const sendOTP = async ({ to, otp, name }) => {
  // Check if it's a phone number (starts with +)
  if (to.startsWith('+') && isSMSConfigured()) {
    try {
      await sendSMS(to, otp);
      return { method: 'sms' };
    } catch (smsErr) {
      console.warn('SMS failed, falling back to email:', smsErr.message);
    }
  }

  // Fall back to email
  if (!emailTransporter) {
    throw new Error('Neither SMS nor email service configured');
  }

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
      <div style="background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 20px; border-radius: 12px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">FindLink</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px; margin-top: 16px;">
        <h2 style="color: #1F2937;">Verify Your Email</h2>
        <p style="color: #4B5563;">Hi <strong>${name}</strong>, welcome to FindLink!</p>
        <p style="color: #4B5563;">Your verification code is:</p>
        <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
          <h1 style="color: #7C3AED; letter-spacing: 8px; font-size: 36px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #6B7280; font-size: 13px;">This code expires in 10 minutes.</p>
      </div>
    </div>
  `;

  try {
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Verify your FindLink account',
      html,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { method: 'email' };
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOTP, isSMSConfigured };