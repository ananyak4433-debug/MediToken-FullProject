
const express = require('express');
const router = express.Router();

const {
  createAppointment, getAppointments, getAppointmentById,
  updateAppointment, deleteAppointment, trackByToken,getMyAppointments  ,
  getVendorAppointments, getAllVendorAppointments, getBookedSlots  ,trackByPhone
} = require('../controllers/appointmentController');


const staffOrVendor = require('../middleware/doctorAuthMiddleware');
const patientProtect = require('../middleware/patientAuthMiddileware');


// ✅ IMPORTANT: specific routes BEFORE param routes
router.post('/appointments/create',      patientProtect,        createAppointment);
router.get('/appointments/booked-slots/:doctorId', getBookedSlots);
router.get('/appointments/track-by-phone', trackByPhone) 
router.get('/appointments/vendor/all', staffOrVendor, getAllVendorAppointments);
router.get('/appointments/vendor',     staffOrVendor, getVendorAppointments); 
router.get('/appointments/my', patientProtect, getMyAppointments);  
router.get('/appointments/get',                  getAppointments);
router.get('/track', trackByToken)
router.get('/appointments/:id',                  getAppointmentById);
router.put('/appointments/:id',                  updateAppointment);
router.delete('/appointments/:id',               deleteAppointment);


module.exports = router;