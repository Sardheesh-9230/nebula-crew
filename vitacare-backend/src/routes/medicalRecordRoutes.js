const express = require('express');
const {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  grantAccess,
  revokeAccess
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getMedicalRecords)
  .post(authorize('doctor', 'hospital_admin'), createMedicalRecord);

router.route('/:id')
  .get(getMedicalRecord)
  .put(authorize('doctor', 'hospital_admin'), updateMedicalRecord);

router.route('/consent')
  .post(grantAccess);

router.route('/consent/:userId')
  .delete(revokeAccess);

module.exports = router;
