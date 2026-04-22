const express = require('express');
const router = express.Router();
const { handleUpload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  createFoundReport,
  getAllFoundReports,
  getMyFoundReports,
  getFoundReportById,
  deleteFoundReport
} = require('../controllers/foundController');

// Public routes
router.get('/', getAllFoundReports);

// Protected routes
router.post('/', protect, handleUpload, createFoundReport);
router.get('/my', protect, getMyFoundReports); // Must be before /:id
router.get('/:id', getFoundReportById); // Made public (controller handles anonymity)
router.delete('/:id', protect, deleteFoundReport);

module.exports = router;
