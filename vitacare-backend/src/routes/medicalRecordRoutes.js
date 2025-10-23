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
  .post(createMedicalRecord); // Allow all authenticated users to create records

router.route('/:id')
  .get(getMedicalRecord)
  .put(updateMedicalRecord); // Allow all authenticated users to update their records

router.route('/consent')
  .post(grantAccess);

router.route('/consent/:userId')
  .delete(revokeAccess);

module.exports = router;
