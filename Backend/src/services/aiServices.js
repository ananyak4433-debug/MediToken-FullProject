// const askGemini = require("./geminiServices");

// const Doctor = require("../models/doctorCollection");
// const Department = require("../models/departmentModel");
// const Appointment = require("../models/appointmentModel");
// // const hospitals = hospitalData.hospitals;

// const {
//     getNextAppointment,
//     getTodayAppointments,
//     getTomorrowAppointments,
//     getUpcomingAppointments,
//     cancelNextAppointment,
//     formatAppointments
// } = require("./appointmentServices");

// const { detectIntent } = require("./intentServices");
// const { extractEntities } = require("./entityExtractor");

// const processUserMessage = async (message, user = null) => {
//     // ===============================
//     // Detect Intent & Entities
//     // ===============================
//     const intentData = await detectIntent(message);
//     const entityData = await extractEntities(message);

//     console.log("Intent:", intentData);
//     console.log("Entities:", entityData);

//     const intent = intentData.intent;

//     const doctor = entityData.doctor;
//     const department = entityData.department;
//     const date = entityData.date || intentData.date;
//     const time = entityData.time || intentData.time;

//     // ===============================
//     // Fetch Hospital Data
//     // ===============================

//     const doctors = await Doctor.find({
//         status: "active"
//     }).select("name specialization experience");

//     const departments = await Department.find({
//         status: "active"
//     }).select("departmentName");

//     // ===============================
//     // Appointment Context
//     // ===============================

//     let appointmentContext = "Patient is not logged in.";

//     if (user) {

//         // NEXT / TODAY / TOMORROW
//         if (intent === "GET_APPOINTMENTS") {

//             let filter = {
//                 patientId: user._id,
//                 status: "booked"
//             };

//             if (date === "today") {

//                 const start = new Date();
//                 start.setHours(0, 0, 0, 0);

//                 const end = new Date();
//                 end.setHours(23, 59, 59, 999);

//                 filter.appointmentDateTime = {
//                     $gte: start,
//                     $lte: end
//                 };

//             } else if (date === "tomorrow") {

//                 const start = new Date();
//                 start.setDate(start.getDate() + 1);
//                 start.setHours(0, 0, 0, 0);

//                 const end = new Date();
//                 end.setDate(end.getDate() + 1);
//                 end.setHours(23, 59, 59, 999);

//                 filter.appointmentDateTime = {
//                     $gte: start,
//                     $lte: end
//                 };

//             } else {

//                 filter.appointmentDateTime = {
//                     $gte: new Date()
//                 };

//             }

//             const appointments = await Appointment.find(filter)
//                 .populate("doctorId", "name specialization")
//                 .sort({
//                     appointmentDateTime: 1
//                 });

//             if (!appointments.length) {

//                 appointmentContext = "No appointments found.";

//             } else {

//                 appointmentContext = appointments
//                     .map(a => `
// Doctor: ${a.doctorId?.name}

// Specialization: ${a.doctorId?.specialization}

// Date: ${new Date(a.appointmentDateTime).toLocaleString("en-IN")}

// Token: ${a.tokenNumber}

// Status: ${a.status}
// `)
//                     .join("\n");

//             }

//         }

//     }

//     // ===============================
//     // Build AI Context
//     // ===============================

//     const context = `
// Hospital Name: MediToken

// Departments:

// ${departments.map(d => d.departmentName).join(", ")}

// Doctors:

// ${doctors.map(d =>
// `${d.name}
// Specialization: ${d.specialization}
// Experience: ${d.experience} years`
// ).join("\n\n")}

// Detected Intent:

// ${intent}

// Detected Doctor:

// ${doctor ? doctor.name : "None"}

// Detected Department:

// ${department ? department.departmentName : "None"}

// Detected Date:

// ${date || "None"}

// Detected Time:

// ${time || "None"}

// Patient Appointments:

// ${appointmentContext}

// Rules:

// You are MediToken AI Assistant.

// Only answer hospital-related questions.

// Never invent doctors.

// Never invent appointments.

// Use the appointment context if available.

// If the user asks to book or cancel an appointment, tell them the request will be processed.
// `;

//     // ===============================
//     // Gemini Response
//     // ===============================

//     const reply = await askGemini(message, context);

//     return reply;
// };

// module.exports = {
//     processUserMessage
// };