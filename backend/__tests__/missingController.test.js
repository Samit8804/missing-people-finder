const MissingReport = require('../models/MissingReport');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn(),
  matchSuggestedEmail: jest.fn(() => '<div>html</div>'),
}));

const { contactMissingReporter } = require('../controllers/missingController');

describe('contactMissingReporter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  function mockContext(withEmail = true) {
    const missingReport = {
      _id: 'missing1',
      name: 'Alice',
      reportedBy: { _id: 'reporter1', email: withEmail ? 'reporter@example.com' : undefined },
      populate() { return Promise.resolve(this); },
    };
    MissingReport.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(missingReport) });
    Match.findOne = jest.fn().mockResolvedValue(null);
    Match.create = jest.fn().mockResolvedValue({ _id: 'match1' });
    Notification.create = jest.fn().mockResolvedValue({});
    return {
      req: { params: { id: 'missing1' }, user: { _id: 'userX', name: 'Tester' } },
      res: { status: jest.fn().mockReturnThis(), json: jest.fn() },
    };
  }

  test('sends reporter email when reporter has email', async () => {
    const { req, res } = mockContext(true);
    const { sendEmail } = require('../utils/sendEmail');
    sendEmail.mockResolvedValue({});
    await contactMissingReporter(req, res);
    expect(sendEmail).toHaveBeenCalled();
    const firstArg = sendEmail.mock.calls[0][0];
    expect(firstArg).toHaveProperty('to', 'reporter@example.com');
  });

  test('does not attempt email if reporter has no email', async () => {
    const { req, res } = mockContext(false);
    await contactMissingReporter(req, res);
    const { sendEmail } = require('../utils/sendEmail');
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
