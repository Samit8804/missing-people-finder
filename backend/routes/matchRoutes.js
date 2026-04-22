const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
  triggerMatching,
  getAllMatches,
  getMyMatches,
  confirmMatch,
  rejectMatch
} = require('../controllers/matchController');

router.use(protect); // All match routes require auth

router.post('/run/:missingId', triggerMatching);
router.get('/', adminOnly, getAllMatches);
router.get('/my', getMyMatches);
router.put('/:id/confirm', confirmMatch);
router.put('/:id/reject', rejectMatch);

module.exports = router;
