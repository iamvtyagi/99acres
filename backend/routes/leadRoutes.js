const express = require('express');
const {
  createLead,
  getUserLeads,
  updateLeadStatus
} = require('../controllers/leadController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').post(createLead).get(protect, getUserLeads);
router.route('/:id').put(protect, updateLeadStatus);

module.exports = router;
