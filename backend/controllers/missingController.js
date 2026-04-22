const MissingReport = require('../models/MissingReport');
const asyncHandler = require('../utils/asyncHandler');

// ─── @route  POST /api/missing ───────────────────────────────────────────────
// @desc    Create a new missing person report
// @access  Private
const createMissingReport = asyncHandler(async (req, res) => {
  const { name, age, gender, description, lastSeenLocation, lastSeenDate, isPublic, contactName, contactPhone, contactEmail } = req.body;
  const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
  const lng = req.body.lng ? parseFloat(req.body.lng) : undefined;

  // Gather uploaded photo URLs if any from Cloudinary multer
  const photos = req.files ? req.files.map(file => file.path) : [];

  const coordinates = (lat !== undefined && lng !== undefined) ? { lat, lng } : undefined;

  const report = await MissingReport.create({
    reportedBy: req.user._id,
    name,
    age,
    gender,
    description,
    lastSeenLocation,
    lastSeenDate,
    coordinates,
    photos,
    isPublic: isPublic !== undefined ? isPublic : true,
    contactName,
    contactPhone,
    contactEmail
  });

  res.status(201).json({ success: true, report });
});

// ─── @route  GET /api/missing ─────────────────────────────────────────────────
// @desc    Get all active public missing reports
// @access  Public
const getAllMissingReports = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  
  let query = { isPublic: true };
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$text = { $search: search };
  }

  const reports = await MissingReport.find(query)
    .populate('reportedBy', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reports.length, reports });
});

// ─── @route  GET /api/missing/my ──────────────────────────────────────────────
// @desc    Get reports created by current user
// @access  Private
const getMyMissingReports = asyncHandler(async (req, res) => {
  const reports = await MissingReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reports.length, reports });
});

// ─── @route  GET /api/missing/:id ─────────────────────────────────────────────
// @desc    Get single missing report
// @access  Public (if public) or Private (if mine/admin)
const getMissingReportById = asyncHandler(async (req, res) => {
  const report = await MissingReport.findById(req.params.id).populate('reportedBy', 'name email phone avatar');

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  // If private, only reporter or admin can view
  if (!report.isPublic && req.user?._id.toString() !== report.reportedBy._id.toString() && req.user?.role !== 'admin') {
     return res.status(403).json({ success: false, message: 'Not authorized to view this report' });
  }

  res.status(200).json({ success: true, report });
});

// ─── @route  PUT /api/missing/:id ──────────────────────────────────────────────
// @desc    Update own missing report
// @access  Private
const updateMissingReport = asyncHandler(async (req, res) => {
  const report = await MissingReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  if (report.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update' });
  }

  const photos = req.files && req.files.length > 0 ? req.files.map(f => f.path) : report.photos;

  const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
  const lng = req.body.lng ? parseFloat(req.body.lng) : undefined;
  const coordinates = (lat !== undefined && lng !== undefined) ? { lat, lng } : report.coordinates;

  const updatedReport = await MissingReport.findByIdAndUpdate(
    req.params.id,
    { ...req.body, photos, coordinates },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, report: updatedReport });
});

// ─── @route  DELETE /api/missing/:id ───────────────────────────────────────────
// @desc    Delete own missing report
// @access  Private
const deleteMissingReport = asyncHandler(async (req, res) => {
  const report = await MissingReport.findById(req.params.id);

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
  createMissingReport,
  getAllMissingReports,
  getMyMissingReports,
  getMissingReportById,
  updateMissingReport,
  deleteMissingReport
};
