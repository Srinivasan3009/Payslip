const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const verifyToken = require('../middleware/auth');
const payslipData = require('../controllers/payslipData');

router.post('/create',verifyToken, subjectController.createSubject);
router.get('/staff/:staff_id',verifyToken, subjectController.getSubjectsByStaff);
router.put('/update/:subject_id',verifyToken, subjectController.updateSubject);
router.post('/delete',verifyToken, subjectController.deleteSubject);
router.get('/subject/:subject_id',verifyToken, subjectController.viewSubject);
router.get('/subjects',verifyToken,subjectController.listOfSubjectsByStaffId)
router.post('/payslip',verifyToken,payslipData)
module.exports = router;