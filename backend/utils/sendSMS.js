const twilio = require('twilio');

let client = null;

// Initialize Twilio client if credentials exist
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('📱 Twilio SMS initialized');
  } catch (err) {
    console.warn('⚠️ Twilio initialization failed:', err.message);
  }
}

/**
 * Send OTP via SMS
 * @param {string} phone - Full phone number with country code (e.g., +1234567890)
 * @param {string} otp - 6-digit OTP code
 */
const sendSMS = async (phone, otp) => {
  if (!client) {
    throw new Error('SMS service not configured');
  }

  try {
    const message = await client.messages.create({
      body: `Your FindLink verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(`📱 SMS sent to ${phone}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`❌ SMS failed to ${phone}:`, error.message);
    throw error;
  }
};

/**
 * Check if SMS is configured
 */
const isSMSConfigured = () => !!client;

module.exports = { sendSMS, isSMSConfigured };