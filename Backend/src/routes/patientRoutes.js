const express = require('express');
const router = express.Router();
const {
    registerPatient,
    loginPatient,
    logoutPatient,
    getPatientProfile,
    getAllPatients
} = require('../controllers/patientController');
const patientProtect = require('../middleware/patientAuthMiddileware');

router.post('/patients/register', registerPatient);
router.post('/patients/login', loginPatient);
router.post('/patients/logout', logoutPatient);
router.get('/patients/profile', patientProtect, getPatientProfile);
router.get('/patients/getAll', getAllPatients);

module.exports = router;