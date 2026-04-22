const Match = require('../models/Match');
const MissingReport = require('../models/MissingReport');
const FoundReport = require('../models/FoundReport');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { runMatching } = require('../services/matchingService');
const { sendEmail, matchConfirmedEmail } = require('../utils/sendEmail');

// ─── @route  POST /api/match/run/:missingId ──────────────────────────────────
// @desc    Trigger matching algorithm manually
// @access  Private
const triggerMatching = asyncHandler(async (req, res) => {
  const result = await runMatching(req.params.missingId);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.status(200).json({ success: true, newMatches: result.count });
});

// ─── @route  GET /api/match ───────────────────────────────────────────────────
// @desc    Get all active matches (Admin only)
// @access  Private (Admin only - middleware applied on routes)
const getAllMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find()
    .populate({ path: 'missingReport', populate: { path: 'reportedBy', select: 'name email' } })
    .populate('foundReport')
    .sort({ matchScore: -1 });
  res.status(200).json({ success: true, count: matches.length, matches });
});

// ─── @route  GET /api/match/my ────────────────────────────────────────────────
// @desc    Get matches for my missing reports
// @access  Private
const getMyMatches = asyncHandler(async (req, res) => {
  // Find missing reports owned by user
  const missingReports = await MissingReport.find({ reportedBy: req.user._id }).select('_id');
  const missingIds = missingReports.map(r => r._id);

  const matches = await Match.find({ missingReport: { $in: missingIds } })
    .populate('missingReport')
    .populate('foundReport')
    .sort({ matchScore: -1 });

  res.status(200).json({ success: true, count: matches.length, matches });
});

// ─── @route  PUT /api/match/:id/confirm ───────────────────────────────────────
// @desc    Confirm a match
// @access  Private
const confirmMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id)
    .populate('missingReport')
    .populate('foundReport');

  if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

  // Only owner of missing report or admin can confirm
  if (match.missingReport.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  match.status = 'confirmed';
  match.reviewedBy = req.user._id;
  match.reviewedAt = Date.now();
  await match.save();

  // Update original reports
  const missing = await MissingReport.findById(match.missingReport._id).populate('reportedBy');
  missing.status = 'found';
  await missing.save();

  const found = await FoundReport.findById(match.foundReport._id).populate('reportedBy');
  found.status = 'matched';
  await found.save();

  // Send confirmation email
  if (missing.reportedBy.email) {
    await sendEmail({
      to: missing.reportedBy.email,
      subject: 'Match Confirmed - FindLink',
      html: matchConfirmedEmail(missing.reportedBy.name, missing.name),
    });
  }

  // Create notification if the reviewer is admin (notify reporter)
  if (req.user.role === 'admin' && missing.reportedBy._id.toString() !== req.user._id.toString()) {
     await Notification.create({
      recipient: missing.reportedBy._id,
      type: 'match_confirmed',
      title: 'Match Confirmed by Admin',
      message: `Your report for ${missing.name} has been marked as found.`,
      relatedReport: match._id,
      relatedReportModel: 'Match',
    });
  }

  res.status(200).json({ success: true, message: 'Match confirmed', match });
});

// ─── @route  PUT /api/match/:id/reject ────────────────────────────────────────
// @desc    Reject a match
// @access  Private
const rejectMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id).populate('missingReport');

  if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

  if (match.missingReport.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  match.status = 'rejected';
  match.reviewedBy = req.user._id;
  match.reviewedAt = Date.now();
  await match.save();

  res.status(200).json({ success: true, message: 'Match rejected', match });
});

module.exports = {
  triggerMatching,
  getAllMatches,
  getMyMatches,
  confirmMatch,
  rejectMatch
};
