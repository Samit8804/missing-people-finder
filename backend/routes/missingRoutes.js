const express = require('express');
const router = express.Router();
const { handleUpload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  createMissingReport,
  getAllMissingReports,
  getMyMissingReports,
  getMissingReportById,
  updateMissingReport,
  deleteMissingReport
} = require('../controllers/missingController');

// Public routes
router.get('/', getAllMissingReports);

// Protected routes
router.post('/', protect, handleUpload, createMissingReport);
router.get('/my', protect, getMyMissingReports); // Must be before /:id to not be seen as id="my"
router.get('/:id', getMissingReportById); // Made public (controller handles private fields logic)
router.post('/:id/contact', protect, contactMissingReporter);
router.put('/:id', protect, handleUpload, updateMissingReport);
router.delete('/:id', protect, deleteMissingReport);

module.exports = router;
