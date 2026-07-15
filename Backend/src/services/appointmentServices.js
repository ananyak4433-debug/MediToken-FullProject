const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorCollection");

// =======================================
// Get Next Appointment
// =======================================

const getNextAppointment = async (patientId) => {
    const appointment = await Appointment.findOne({
        patientId,
        appointmentDateTime: { $gte: new Date() },
        status: "booked"
    })
        .populate("doctorId", "name specialization")
        .populate("vendorId", "organisationName")
        .sort({ appointmentDateTime: 1 });

    return appointment;
};

// =======================================
// Get Today's Appointments
// =======================================

const getTodayAppointments = async (patientId) => {

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return await Appointment.find({
        patientId,
        appointmentDateTime: {
            $gte: start,
            $lte: end
        },
        status: "booked"
    })
        .populate("doctorId", "name specialization")
        .populate("vendorId", "organisationName")
        .sort({ appointmentDateTime: 1 });
};

// =======================================
// Get Tomorrow's Appointments
// =======================================

const getTomorrowAppointments = async (patientId) => {

    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 1);
    end.setHours(23, 59, 59, 999);

    return await Appointment.find({
        patientId,
        appointmentDateTime: {
            $gte: start,
            $lte: end
        },
        status: "booked"
    })
        .populate("doctorId", "name specialization")
        .populate("vendorId", "organisationName")
        .sort({ appointmentDateTime: 1 });
};

// =======================================
// Get All Upcoming Appointments
// =======================================

const getUpcomingAppointments = async (patientId) => {

    return await Appointment.find({
        patientId,
        appointmentDateTime: {
            $gte: new Date()
        },
        status: "booked"
    })
        .populate("doctorId", "name specialization")
        .populate("vendorId", "organisationName")
        .sort({ appointmentDateTime: 1 });
};

// =======================================
// Cancel Next Appointment
// =======================================

const cancelNextAppointment = async (patientId) => {

    const appointment = await Appointment.findOne({
        patientId,
        appointmentDateTime: {
            $gte: new Date()
        },
        status: "booked"
    }).sort({
        appointmentDateTime: 1
    });

    if (!appointment) {
        return null;
    }

    appointment.status = "cancelled";
    appointment.canceledAt = new Date();

    await appointment.save();

    return appointment;
};

// =======================================
// Format Appointment Response
// =======================================

const formatAppointments = (appointments) => {

    if (!appointments || appointments.length === 0) {
        return "No appointments found.";
    }

    return appointments.map(a => `
Doctor : ${a.doctorId?.name}

Department : ${a.doctorId?.specialization}

Hospital : ${a.vendorId?.organisationName || "N/A"}

Date : ${new Date(a.appointmentDateTime).toLocaleDateString("en-IN")}

Time : ${a.appointmentTime}

Token : ${a.tokenNumber}

Status : ${a.status}
`).join("\n---------------------------------\n");
};


// =======================================
// Convert 12-hour time to 24-hour
// =======================================

const parseDDMMYYYY = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);

    return new Date(year, month - 1, day);
};

const convertTo24Hour = (timeStr) => {

    if (!timeStr) return "00:00";

    const [time, modifier] = timeStr.split(" ");

    let [hours, minutes] = time.split(":");

    if (modifier.toUpperCase() === "PM" && hours !== "12") {
        hours = String(Number(hours) + 12);
    }

    if (modifier.toUpperCase() === "AM" && hours === "12") {
        hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes || "00"}`;
};

// =======================================
// Token Generator
// =======================================

const parseMin = (timeStr) => {

    const [time, period] = timeStr.split(" ");

    let [h, m] = time.split(":").map(Number);

    if (period === "PM" && h !== 12) h += 12;

    if (period === "AM" && h === 12) h = 0;

    return h * 60 + m;
};

const getTokenNumberFromTime = (timeStr) => {

    const SLOT_INTERVAL = 15;

    const DAY_START = parseMin("9:00 AM");

    const token =
        Math.floor((parseMin(timeStr) - DAY_START) / SLOT_INTERVAL) + 1;

    return token > 0 ? token : 1;
};

// =======================================
// Check Slot Availability
// =======================================


const checkSlotAvailability = async (
    doctorId,
    appointmentDate,
    appointmentTime
) => {

    let appointmentDateTime;

    if (appointmentDate.includes("/")) {
        const [day, month, year] = appointmentDate.split("/");

        appointmentDateTime = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );
    } else {
        appointmentDateTime = new Date(`${appointmentDate}T00:00:00`);
    }

    const [hours, minutes] = convertTo24Hour(appointmentTime)
        .split(":")
        .map(Number);

    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const existing = await Appointment.findOne({
        doctorId,
        appointmentDateTime,
        status: {
            $in: ["booked", "serving"]
        }
    });

    return !existing;
};


// =======================================
// Get Available Slots
// =======================================

const getAvailableSlots = async (doctorId, appointmentDate) => {

    const doctor = await Doctor.findById(doctorId);

    if (!doctor || doctor.status !== "active") {
        return [];
    }

    const selectedDate = new Date(appointmentDate);

    // Get weekday
    const selectedDay = selectedDate.toLocaleDateString("en-US", {
        weekday: "long"
    });

    // Find doctor's availability for that day
    const availability = doctor.availability.find(
        a => a.day.toLowerCase() === selectedDay.toLowerCase()
    );

    // Doctor doesn't work that day
    if (!availability) {
        return [];
    }

    // -----------------------------
    // Helper: Convert "09:15 AM" → minutes
    // -----------------------------

    const parseTime = (timeStr) => {

        let [time, modifier] = timeStr.split(" ");

        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }

        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    // -----------------------------
    // Helper: Minutes → "09:15 AM"
    // -----------------------------

    const formatTime = (mins) => {

        let hours = Math.floor(mins / 60);
        let minutes = mins % 60;

        const modifier = hours >= 12 ? "PM" : "AM";

        hours %= 12;

        if (hours === 0) hours = 12;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${modifier}`;
    };

    const start = parseTime(availability.startTime);
    const end = parseTime(availability.endTime);

    const breakStart = availability.breakStart
        ? parseTime(availability.breakStart)
        : null;

    const breakEnd = availability.breakEnd
        ? parseTime(availability.breakEnd)
        : null;

    const now = new Date();

    const today =
        selectedDate.toDateString() === now.toDateString();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    // -----------------------------
    // Generate slots
    // -----------------------------

    const allSlots = [];

    for (let mins = start; mins < end; mins += 15) {

        // Skip break time
        if (
            breakStart !== null &&
            breakEnd !== null &&
            mins >= breakStart &&
            mins < breakEnd
        ) {
            continue;
        }

        // Skip past slots for today
        if (today && mins <= currentMinutes) {
            continue;
        }

        allSlots.push(formatTime(mins));
    }

    // -----------------------------
    // Remove booked slots
    // -----------------------------

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
        doctorId,
        appointmentDateTime: {
            $gte: startOfDay,
            $lte: endOfDay
        },
        status: {
            $in: ["booked", "serving"]
        }
    }).select("appointmentTime");

    const bookedSlots = bookedAppointments.map(
        appt => appt.appointmentTime
    );

    return allSlots.filter(
        slot => !bookedSlots.includes(slot)
    );
};


// =======================================
// Book Appointment
// =======================================

const bookAppointment = async ({
    user,
    doctor,
    date,
    time
}) => {

    console.log("===== BOOK APPOINTMENT =====");
    console.log({
        user: user._id,
        doctor: doctor._id,
        date,
        time
    });

    if (!doctor) {

        return {
            success: false,
            message: "Doctor not found."
        };

    }

    if (!date || !time) {

        return {
            success: false,
            message: "Please provide both date and time."
        };

    }

    const available = await checkSlotAvailability(
        doctor._id,
        date,
        time
    );

    if (!available) {

        return {
            success: false,
            message: "This slot is already booked."
        };

    }

    // const appointmentDateTime = parseDDMMYYYY(date);
    // const appointmentDateTime = new Date(date);

    let appointmentDateTime;

    if (date.includes("/")) {

        if (date.includes("/")) {
            const [day, month, year] = date.split("/");

            appointmentDateTime = new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );
        } else {
            appointmentDateTime = new Date(`${date}T00:00:00`);
        }
    } else {
        // Handles YYYY-MM-DD
        appointmentDateTime = new Date(`${date}T00:00:00`);
    }

    if (isNaN(appointmentDateTime.getTime())) {
        throw new Error(`Invalid date received: ${date}`);
    }

    const [hours, minutes] = convertTo24Hour(time)
        .split(":")
        .map(Number);

    appointmentDateTime.setHours(hours, minutes, 0, 0);

    try {
        console.log("Creating appointment...");

        const appointment = await Appointment.create({
            vendorId: doctor.vendorId,
            doctorId: doctor._id,
            patientId: user._id,
            patientName: user.name,
            appointmentDate: new Date(
                appointmentDateTime.getFullYear(),
                appointmentDateTime.getMonth(),
                appointmentDateTime.getDate()
            ),
            appointmentDateTime,
            appointmentTime: time,
            appointmentDay: appointmentDateTime.toLocaleDateString("en-US", {
                weekday: "long"
            }),
            tokenNumber: getTokenNumberFromTime(time),
            status: "booked"
        });

        console.log("Appointment saved:");
        console.log(appointment);

        return {
            success: true,
            appointment
        };

    } catch (err) {
        console.error("BOOK APPOINTMENT ERROR:");
        console.error(err);
        console.error(err.stack);
        throw err;
    }
    return {
        success: true,
        appointment
    };

};

// =======================================
// Reschedule Appointment
// =======================================

const rescheduleAppointment = async (
    patientId,
    newDate,
    newTime
) => {

    const appointment = await Appointment.findOne({

        patientId,

        appointmentDateTime: {
            $gte: new Date()
        },

        status: "booked"

    }).sort({
        appointmentDateTime: 1
    });

    if (!appointment) {

        return null;

    }

    const available = await checkSlotAvailability(
        appointment.doctorId,
        newDate,
        newTime
    );

    if (!available) {

        return {
            success: false,
            message: "Selected slot is already booked."
        };

    }

    appointment.appointmentDate = newDate;

    appointment.appointmentDateTime = parseDDMMYYYY(newDate);

    const [hours, minutes] = convertTo24Hour(newTime)
        .split(":")
        .map(Number);

    appointment.appointmentDateTime.setHours(hours, minutes, 0, 0);

    appointment.appointmentTime = newTime;

    appointment.tokenNumber = getTokenNumberFromTime(newTime);

    await appointment.save();

    return {

        success: true,

        appointment

    };

};

module.exports = {
    getNextAppointment,
    getTodayAppointments,
    getTomorrowAppointments,
    getUpcomingAppointments,
    cancelNextAppointment,
    formatAppointments,
    checkSlotAvailability,
    getAvailableSlots,
    bookAppointment,
    rescheduleAppointment
};