const nodemailer = require('nodemailer');

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    // Propagate error to caller so the API can inform the client
    throw error;
  }
};

// ─── Email Templates ────────────────────────────────────────────────────────

const matchSuggestedEmail = (reporterName, matchScore, missingName) => `
<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <div style="background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 24px; border-radius: 12px; text-align: center;">
    <h1 style="color: white; margin: 0;">FindLink</h1>
    <p style="color: #E0D7FF; margin: 4px 0 0;">Missing Persons Platform</p>
  </div>
  <div style="padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px; margin-top: 16px;">
    <h2 style="color: #1F2937;">🔍 Potential Match Found!</h2>
    <p style="color: #4B5563;">Hi <strong>${reporterName}</strong>,</p>
    <p style="color: #4B5563;">
      We found a potential match for <strong>${missingName}</strong> with a match score of 
      <strong style="color: #7C3AED;">${matchScore}%</strong>.
    </p>
    <p style="color: #4B5563;">
      Please log in to your FindLink dashboard to review the match and confirm or reject it.
    </p>
    <a href="${process.env.CLIENT_URL}/dashboard/matches" 
       style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; 
              border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">
      Review Match →
    </a>
  </div>
  <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 16px;">
    © 2025 FindLink. If this wasn't you, please ignore this email.
  </p>
</div>
`;

const matchConfirmedEmail = (reporterName, missingName) => `
<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <div style="background: linear-gradient(135deg, #059669, #047857); padding: 24px; border-radius: 12px; text-align: center;">
    <h1 style="color: white; margin: 0;">FindLink</h1>
  </div>
  <div style="padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px; margin-top: 16px;">
    <h2 style="color: #1F2937;">✅ Match Confirmed!</h2>
    <p style="color: #4B5563;">Hi <strong>${reporterName}</strong>,</p>
    <p style="color: #4B5563;">
      Great news! The match for <strong>${missingName}</strong> has been confirmed.
      The case status has been updated.
    </p>
    <a href="${process.env.CLIENT_URL}/dashboard" 
       style="display: inline-block; background: #059669; color: white; padding: 12px 24px; 
              border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">
      View Dashboard →
    </a>
  </div>
</div>
`;

module.exports = { sendEmail, matchSuggestedEmail, matchConfirmedEmail };
