// ─── Quick email test ────────────────────────────────────────────────────────
// Run: node test-email.js <recipient-email>
// Example: node test-email.js samitfartyal@gmail.com
// ─────────────────────────────────────────────────────────────────────────────
require('dotenv').config();

const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;
const to = process.argv[2] || user;

console.log('EMAIL_HOST :', host);
console.log('EMAIL_PORT :', port);
console.log('EMAIL_USER :', user);
console.log('EMAIL_PASS :', pass ? '******** (hidden)' : '❌ NOT SET');
console.log('EMAIL_FROM :', process.env.EMAIL_FROM);
console.log('Sending to :', to);
console.log('---');

if (!host || !port || !user || !pass) {
  console.error('❌ Missing env vars. Check your .env file.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port: parseInt(port, 10),
  secure: false,
  auth: { user, pass },
  tls: { rejectUnauthorized: false },
});

transporter.verify()
  .then(() => {
    console.log('✅ Transporter verified successfully.');
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || user,
      to,
      subject: '[FindLink] Email Configuration Test',
      html: `<p>This is a test email from FindLink.</p><p>If you received this, your email credentials are working correctly.</p>`,
    });
  })
  .then((info) => {
    console.log('✅ Email sent:', info.messageId);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    if (err.code) console.error('   Code:', err.code);
    if (err.response) console.error('   Response:', err.response);
    process.exit(1);
  });
