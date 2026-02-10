const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/apply', leaveController.applyLeave);
router.get('/:userId', leaveController.getUserLeaves);
router.get('/', leaveController.getAllLeaves); // For admin
router.put('/approve/:id', leaveController.approveLeave);
router.put('/reject/:id', leaveController.rejectLeave);

module.exports = router;
