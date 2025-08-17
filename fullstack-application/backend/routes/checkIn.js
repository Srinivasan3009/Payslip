const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const verifyToken = require('../middleware/auth');
router.get('/api/check-auth', verifyToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.name || 'user'}!` });
  });
router.post('/addAttendance',verifyToken, attendanceController.addAttendance);
router.post('/getAttendance',verifyToken, attendanceController.getAttendance);
router.get('/viewAttendance',verifyToken, attendanceController.viewAttendance);
router.put('/updateAttendance',verifyToken, attendanceController.updateAttendance);
router.post('/deleteAttendance',verifyToken, attendanceController.deleteAttendance);
module.exports = router;