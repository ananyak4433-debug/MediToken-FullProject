const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorCollection'); 

// ==============================
// 🧠 TIME HELPERS
// ==============================

// Convert "9:00 AM" → minutes
const parseMin = (timeStr) => {
  if (!timeStr) return null;
  const [time, period] = timeStr.split(' ');
  let [h, m] = time.split(':').map(Number);

  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  return h * 60 + m;
};

// ==============================
// 🎯 TOKEN GENERATION
// ==============================

const getTokenNumberFromTime = (timeStr) => {
  if (!timeStr) return 1;

  const SLOT_INTERVAL = 15;
  const DAY_START = parseMin('9:00 AM');

  const apptMin = parseMin(timeStr);
  const tokenNumber = Math.floor((apptMin - DAY_START) / SLOT_INTERVAL) + 1;

  return tokenNumber > 0 ? tokenNumber : 1;
};

// ==============================
// 🔄 12hr → 24hr CONVERTER
// ==============================

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "00:00";

  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }

  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
};


// ==============================
// 🆕 CREATE APPOINTMENT
// ==============================

exports.createAppointment = async (req, res) => {
  try {
    const { 
      vendorId, staffId, doctorId,
      patientName, patientAge, patientGender,
      appointmentDay, appointmentTime, appointmentDate,
      notes
    } = req.body;

    // ✅ Combine DATE + TIME → FULL DATETIME (CRITICAL FIX)
    const appointmentDateTime = new Date(
      `${appointmentDate}T${convertTo24Hour(appointmentTime)}:00+05:30`
    );

    const tokenNumber = getTokenNumberFromTime(appointmentTime);

    const newAppointment = new Appointment({
      vendorId,
      staffId: staffId || null,
      doctorId,
      patientId: req.patient?._id || req.body.patientId,
      patientName,
      patientAge,
      patientGender,
      appointmentDay,
      appointmentTime,
      appointmentDate: new Date(appointmentDate),
      appointmentDateTime, // ✅ NEW FIELD
      notes,
      tokenNumber,
      status: 'booked'
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      appointment: newAppointment
    });

  } catch (err) {
    console.error('❌ Appointment error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// 📋 GET ALL
// ==============================

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ tokenNumber: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json('Failed to fetch appointments');
  }
};

// ==============================
// 🔍 GET BY ID
// ==============================

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'name specialization photo')
      .populate('vendorId', 'organisationName address');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const patientsAhead = await Appointment.countDocuments({
      doctorId: appointment.doctorId,
      appointmentDateTime: {
        $lt: appointment.appointmentDateTime
      },
      status: { $in: ['booked', 'serving'] }
    });

    res.status(200).json({
      success: true,
      appointment,
      patientsAhead
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// ✏️ UPDATE
// ==============================

exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (req.body.status === 'cancelled') {
      updatedAppointment.canceledAt = new Date();
      await updatedAppointment.save();
    }

    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(500).json('Failed to update appointment');
  }
};

// ==============================
// ❌ DELETE
// ==============================

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json('Appointment deleted successfully');
  } catch (err) {
    res.status(500).json('Failed to delete appointment');
  }
};

// ==============================
// 📅 GET BOOKED SLOTS (FIXED)
// ==============================

exports.getBookedSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDateTime: { $gte: start, $lte: end },
      status: { $in: ['booked', 'serving'] }
    }).select('appointmentTime');

    const bookedTimes = appointments.map(a => a.appointmentTime);

    res.json({ success: true, bookedTimes });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// 🏥 TODAY (FIXED)
// ==============================

exports.getVendorAppointments = async (req, res) => {
  try {
    const vendorId = req.vendor?._id || req.user?.vendorId;  // ✅

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'Vendor ID not found' });
    }

    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayName = DAYS[new Date().getDay()];

    const appointments = await Appointment.find({
      vendorId,
      appointmentDay: todayName
    })
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name phone')
      .sort({ tokenNumber: 1 });

    console.log('✅ Today appointments:', appointments.length);
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==============================
// 📊 FILTER BY DATE
// ==============================

exports.getAllVendorAppointments = async (req, res) => {
  try {
    // ✅ vendor sees their own appointments
    // ✅ staff sees their vendor's appointments
    const vendorId = req.vendor?._id || req.user?.vendorId;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'Vendor ID not found' });
    }

    const { date } = req.query;
    let filter = { vendorId };

    if (date) {
      const baseDate = new Date(date);
      const start = new Date(baseDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(baseDate);
      end.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name phone')
      .sort({ tokenNumber: 1 });

    console.log('✅ Found appointments:', appointments.length);
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};