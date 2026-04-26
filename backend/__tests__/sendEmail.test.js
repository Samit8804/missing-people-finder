const nodemailer = require('nodemailer');
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((mail) => Promise.resolve({ messageId: 'msg-id' })),
  })),
}));

const { sendEmail } = require('../utils/sendEmail');

describe('sendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends email successfully', async () => {
    const info = await sendEmail({ to: 'a@example.com', subject: 'sub', html: '<p>hi</p>' });
    expect(info).toHaveProperty('messageId');
  });

  test('throws on SMTP failure', async () => {
    const transporter = require('nodemailer').createTransport.mock.results[0].value;
    transporter.sendMail.mockRejectedValueOnce(new Error('SMTP error'));
    await expect(sendEmail({ to: 'b@example.com', subject: 'sub', html: '' })).rejects.toThrow('SMTP error');
  });
});
