const express = require('express');
const {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  grantAccess,
  revokeAccess,
  uploadMedicalRecord
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getMedicalRecords)
  .post(createMedicalRecord); // Allow all authenticated users to create records

router.route('/upload')
  .post(upload.single('file'), uploadMedicalRecord); // File upload endpoint

router.route('/:id')
  .get(getMedicalRecord)
  .put(updateMedicalRecord); // Allow all authenticated users to update their records

router.route('/consent')
  .post(grantAccess);

router.route('/consent/:userId')
  .delete(revokeAccess);

module.exports = router;
