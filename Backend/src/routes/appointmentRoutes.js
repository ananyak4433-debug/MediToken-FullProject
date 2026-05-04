
const express = require('express');
const router = express.Router();

const {
  createAppointment, getAppointments, getAppointmentById,
  updateAppointment, deleteAppointment,
  getVendorAppointments, getAllVendorAppointments, getBookedSlots // ✅ all exports
} = require('../controllers/appointmentController');

const staffOrVendor = require('../middleware/doctorAuthMiddleware');

// ✅ IMPORTANT: specific routes BEFORE param routes
router.post('/appointments/create',              createAppointment);
router.get('/appointments/booked-slots/:doctorId', getBookedSlots);
router.get('/appointments/vendor/all', staffOrVendor, getAllVendorAppointments); // ✅ before /vendor
router.get('/appointments/vendor',     staffOrVendor, getVendorAppointments);    // ✅ before /:id
router.get('/appointments/get',                  getAppointments);
router.get('/appointments/:id',                  getAppointmentById);
router.put('/appointments/:id',                  updateAppointment);
router.delete('/appointments/:id',               deleteAppointment);

module.exports = router;