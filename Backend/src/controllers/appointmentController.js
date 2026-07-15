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

    console.log("===== CREATE APPOINTMENT =====");
    console.log(req.body);
    console.log("appointmentDate:", appointmentDate);
    console.log("appointmentTime:", appointmentTime);

    // ✅ Combine DATE + TIME → FULL DATETIME (CRITICAL FIX)
    // const [day, month, year] = appointmentDate.split("/");

    // const appointmentDateTime = new Date(
    //   Number(year),
    //   Number(month) - 1,
    //   Number(day)
    // );


    let appointmentDateTime;

    if (appointmentDate.includes("/")) {
      const [day, month, year] = appointmentDate.split("/");

      appointmentDateTime = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    } else {
      // Handles YYYY-MM-DD
      appointmentDateTime = new Date(`${appointmentDate}T00:00:00`);
    }

    const [hours, minutes] = convertTo24Hour(appointmentTime)
      .split(":")
      .map(Number);

    appointmentDateTime.setHours(hours, minutes, 0, 0);

    console.log("appointmentDateTime:", appointmentDateTime);
    console.log("Is valid:", !isNaN(appointmentDateTime.getTime()));

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDateTime,
      status: {
        $in: ["booked", "serving"]
      }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked'
      });
    }

    const tokenNumber = getTokenNumberFromTime(appointmentTime);

    const newAppointment = new Appointment({
      vendorId,
      staffId: staffId || null,
      doctorId,
      // patientId: req.user?._id || req.body.patientId,
      patientId: req.user._id,
      patientName,
      patientAge,
      patientGender,
      appointmentDay,
      appointmentTime,
      appointmentDate,
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

    console.log("Requested date:", date);
    console.log("Doctor:", doctorId);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    console.log("Start:", start);
    console.log("End:", end);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDateTime: {
        $gte: start,
        $lte: end
      },
      status: {
        $in: ["booked", "serving"]
      }
    }).select("appointmentTime appointmentDateTime");

    console.log("Appointments Found:", appointments);

    const bookedTimes = appointments.map(a => a.appointmentTime);

    res.json({
      success: true,
      bookedTimes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
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

    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

// exports.getAllVendorAppointments = async (req, res) => {
//   try {
//     // ✅ vendor sees their own appointments
//     // ✅ staff sees their vendor's appointments
//     const vendorId = req.vendor?._id || req.user?.vendorId;

//     if (!vendorId) {
//       return res.status(400).json({ success: false, message: 'Vendor ID not found' });
//     }

//     const { date } = req.query;
//     let filter = { vendorId };

//     if (date) {
//       const baseDate = new Date(date);
//       const start = new Date(baseDate);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(baseDate);
//       end.setHours(23, 59, 59, 999);
//       filter.appointmentDate = { $gte: start, $lte: end };
//     }

//     const appointments = await Appointment.find(filter)
//       .populate('doctorId', 'name specialization')
//       .populate('patientId', 'name phone')
//       .sort({ tokenNumber: 1 });

//     console.log('✅ Found appointments:', appointments.length);
//     res.json({ success: true, data: appointments });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



exports.getAllVendorAppointments = async (req, res) => {
  try {
    const vendorId = req.vendor?._id || req.user?.vendorId;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'Vendor ID not found' });
    }

    const { date } = req.query;

    // ✅ Default to today if no date provided
    const dateStr = date || new Date().toISOString().split('T')[0]; // "2026-05-05"

    // ✅ Parse as UTC midnight to UTC end of day
    // Since appointments are stored as "2026-05-04T00:00:00.000Z" (UTC midnight)
    // we just match the exact date string range in UTC
    const start = new Date(`${dateStr}T00:00:00.000Z`);
    const end = new Date(`${dateStr}T23:59:59.999Z`);

    console.log('📅 Filtering date:', dateStr);
    console.log('📅 Start:', start.toISOString());
    console.log('📅 End:', end.toISOString());

    const appointments = await Appointment.find({
      vendorId,
      appointmentDate: { $gte: start, $lte: end }
    })
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name phone')
      .sort({ tokenNumber: 1 });

    console.log('✅ Found appointments:', appointments.length);
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// GET /api/appointments/track?tokenNumber=42&department=Cardiology
exports.trackByToken = async (req, res) => {
  const { tokenNumber, department } = req.query
  try {
    const appointments = await Appointment.find({
      tokenNumber: Number(tokenNumber),
      status: { $in: ['booked', 'serving', 'completed', 'cancelled'] }
    }).populate('doctorId vendorId')

    const appointment = appointments.find(a =>
      a.doctorId?.specialization?.toLowerCase().includes(department.toLowerCase())
    )

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found. Check token number and department.' })
    }

    // const patientsAhead = await Appointment.countDocuments({
    //   tokenNumber: { $lt: appointment.tokenNumber },
    //   status: { $in: ['booked', 'serving'] }
    // })

    const start = new Date(appointment.appointmentDateTime);
    start.setHours(0, 0, 0, 0);

    const end = new Date(appointment.appointmentDateTime);
    end.setHours(23, 59, 59, 999);

    const patientsAhead = await Appointment.countDocuments({
      doctorId: appointment.doctorId._id,
      appointmentDateTime: {
        $gte: start,
        $lte: end,
        $lt: appointment.appointmentDateTime
      },
      status: { $in: ["booked", "serving"] }
    });

    res.json({ appointment, patientsAhead })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}



exports.trackByPhone = async (req, res) => {
  const { phone, date } = req.query
  try {
    const Patient = require('../models/patientModel')
    const patient = await Patient.findOne({ phone: phone.trim() })

    if (!patient) {
      return res.status(404).json({ message: 'No patient found with this phone number.' })
    }

    const dateStr = date || new Date().toISOString().split('T')[0]
    const start = new Date(`${dateStr}T00:00:00.000Z`)
    const end = new Date(`${dateStr}T23:59:59.999Z`)

    // ✅ Search by patientName instead of patientId
    const appointments = await Appointment.find({
      patientName: { $regex: new RegExp(patient.name, 'i') },
      appointmentDate: { $gte: start, $lte: end }
    })
      .populate('doctorId', 'name specialization photo')
      .populate('vendorId', 'organisationName address')
      .sort({ tokenNumber: 1 })

    console.log('📋 Appointments by name:', appointments.length)

    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found for today.' })
    }

    const results = await Promise.all(appointments.map(async (appointment) => {
      const patientsAhead = await Appointment.countDocuments({
        doctorId: appointment.doctorId,
        appointmentDateTime: { $lt: appointment.appointmentDateTime },
        status: { $in: ['booked', 'serving'] }
      })
      return { appointment, patientsAhead }
    }))

    res.json({ success: true, results })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}



// ==============================
// 👤 GET MY APPOINTMENTS (PATIENT)
// ==============================

exports.getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user?._id;

    if (!patientId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ patientId })
      .populate('vendorId', 'organisationName address phone')  // 👈 fixes hospital N/A
      .populate('doctorId', 'name specialization photo')        // 👈 fixes doctor name
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, appointments });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};