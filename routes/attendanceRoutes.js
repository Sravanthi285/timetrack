const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/checkin', attendanceController.checkIn);
router.get('/:userId', attendanceController.getAttendance);
router.get('/', attendanceController.getAllAttendance); // for admin

module.exports = router;
