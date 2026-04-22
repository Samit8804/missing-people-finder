const FoundReport = require('../models/FoundReport');
const asyncHandler = require('../utils/asyncHandler');

// ─── @route  POST /api/found ─────────────────────────────────────────────────
// @desc    Create a new found person report
// @access  Private
const createFoundReport = asyncHandler(async (req, res) => {
  const { isAnonymous, approximateAge, gender, description, locationFound, dateFound } = req.body;
  const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
  const lng = req.body.lng ? parseFloat(req.body.lng) : undefined;

  const photos = req.files ? req.files.map(file => file.path) : [];
  const coordinates = (lat !== undefined && lng !== undefined) ? { lat, lng } : undefined;

  const report = await FoundReport.create({
    reportedBy: req.user._id,
    isAnonymous: isAnonymous !== undefined ? isAnonymous : false,
    approximateAge,
    gender,
    description,
    locationFound,
    dateFound,
    coordinates,
    photos
  });

  res.status(201).json({ success: true, report });
});

// ─── @route  GET /api/found ───────────────────────────────────────────────────
// @desc    Get all found reports
// @access  Public
const getAllFoundReports = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  
  let query = {};
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$text = { $search: search };
  }

  const reports = await FoundReport.find(query)
    .populate('reportedBy', 'name avatar') // For anonymous ones, frontend might hide this name if isAnonymous=true
    .sort({ createdAt: -1 });

  // Safety filter for anonymous reporters
  const sanitizedReports = reports.map(r => {
    if (r.isAnonymous) {
      r.reportedBy = null; // Hide reporter details
    }
    return r;
  });

  res.status(200).json({ success: true, count: sanitizedReports.length, reports: sanitizedReports });
});

// ─── @route  GET /api/found/my ─────────────────────────────────────────────────
// @desc    Get found reports created by current user
// @access  Private
const getMyFoundReports = asyncHandler(async (req, res) => {
  const reports = await FoundReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reports.length, reports });
});

// ─── @route  GET /api/found/:id ───────────────────────────────────────────────
// @desc    Get a single found report
// @access  Public
const getFoundReportById = asyncHandler(async (req, res) => {
  const report = await FoundReport.findById(req.params.id).populate('reportedBy', 'name email phone avatar');

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  // Sanitize if anonymous (unless viewer is admin or the creator)
  if (report.isAnonymous) {
    const isOwner = req.user && req.user._id.toString() === report.reportedBy._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      report.reportedBy = null;
    }
  }

  res.status(200).json({ success: true, report });
});

// ─── @route  DELETE /api/found/:id ─────────────────────────────────────────────
// @desc    Delete own found report
// @access  Private
const deleteFoundReport = asyncHandler(async (req, res) => {
  const report = await FoundReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  if (report.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete' });
  }

  await report.deleteOne();

  res.status(200).json({ success: true, message: 'Report deleted' });
});

module.exports = {
  createFoundReport,
  getAllFoundReports,
  getMyFoundReports,
  getFoundReportById,
  deleteFoundReport
};
