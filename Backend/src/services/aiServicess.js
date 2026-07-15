const askGemini = require("./geminiServices");

const Doctor = require("../models/doctorCollection");
const Department = require("../models/departmentModel");
const Vendor = require("../models/vendorModel");
const Appointment = require("../models/appointmentModel");

const {
    detectIntent
} = require("./intentServices");

const {
    extractEntities
} = require("./entityExtractor");

const {
    getNextAppointment,
    getTodayAppointments,
    getTomorrowAppointments,
    getUpcomingAppointments,
    cancelNextAppointment,
    formatAppointments,
    getAvailableSlots,
    bookAppointment,
    rescheduleAppointment
} = require("./appointmentServices");

const {
    getMemory,
    saveMemory,
    clearMemory
} = require("./conversationMemory");

// ===========================================
// Format Date
// ===========================================

const formatDate = (dateObj) => {

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

};

// ===========================================
// Normalize Date
// ===========================================

const normalizeDate = (date) => {

    if (!date) return null;

    date = String(date).trim().toLowerCase();

    const today = new Date();

    if (date === "today") {
        return today.toLocaleDateString("en-CA");
    }

    if (date === "tomorrow") {
        today.setDate(today.getDate() + 1);
        return today.toLocaleDateString("en-CA");
    }

    return date;
};

// ===========================================
// Build Hospital Context
// ===========================================

// const buildHospitalContext = async () => {

//     const doctors = await Doctor.find({
//         status: "active"
//     }).select(
//         "name specialization experience availability vendorId"
//     );

//     const departments = await Department.find({
//         status: "active"
//     }).select(
//         "departmentName description"
//     );

//     const hospitals = await Vendor.find({
//         status: "active"
//     }).select(
//         "organisationName address phone"
//     );

//     return {

//         doctors,
//         departments,
//         hospitals

//     };

// };

// ===========================================
// Find Doctor by Name
// ===========================================

const findDoctor = async (doctorName) => {

    if (!doctorName) return null;

    const doctor = await Doctor.findOne({
        status: "active",
        name: {
            $regex: `^${doctorName}$`,
            $options: "i"
        }
    });

    return doctor;

};


const getAvailableDoctors = async () => {

    const doctors = await Doctor.find({
        status: "active"
    }).select("name specialization");

    if (!doctors.length) {
        return "No doctors are currently available.";
    }

    return doctors
        .map(
            doctor =>
                `• ${doctor.name} (${doctor.specialization})`
        )
        .join("\n");

};

// ===========================================
// Find Department
// ===========================================

const findDepartment = async (departmentName) => {

    if (!departmentName) return null;

    const department = await Department.findOne({

        departmentName: {
            $regex: `^${departmentName}$`,
            $options: "i"
        },
        status: "active"

    });

    return department;

};

// ===========================================
// Doctor Information
// ===========================================

const getDoctorInfo = async (doctorName) => {

    const doctor = await findDoctor(doctorName);

    if (!doctor) {

        return "Doctor not found.";

    }

    let availability = "";

    if (doctor.availability?.length) {

        availability = doctor.availability
            .map(a =>
                `${a.day}: ${a.startTime} - ${a.endTime}`
            )
            .join("\n");

    } else {

        availability = "Availability not updated.";

    }

    return `

Doctor Name : ${doctor.name}

Department : ${doctor.specialization}

Experience : ${doctor.experience} years

Availability :

${availability}

`;

};

// ===========================================
// Department Information
// ===========================================

const getDepartmentInfo = async (departmentName) => {

    const department = await findDepartment(
        departmentName
    );

    if (!department) {

        return "Department not found.";

    }

    const doctors = await Doctor.find({

        specialization: {
            $regex: department.departmentName,
            $options: "i"
        },

        status: "active"

    }).select("name experience");

    let doctorList = "No doctors available.";

    if (doctors.length) {

        doctorList = doctors
            .map(
                d =>
                    `${d.name} (${d.experience} yrs)`
            )
            .join("\n");

    }

    return `

Department :

${department.departmentName}

Description :

${department.description || "No description available."}

Doctors :

${doctorList}

`;

};

// ===========================================
// Gemini Fallback
// ===========================================

const askGeneralQuestion = async (
    message,
    hospitals,
    doctors,
    departments
) => {

    const context = `

Platform Name: MediToken

You are the MediToken AI Assistant.

MediToken is an online healthcare appointment booking platform.

It allows patients to:

• Find hospitals

• Find doctors

• Book appointments

• Cancel appointments

• Reschedule appointments

Hospitals available on MediToken:

${hospitals.map(h => `
Hospital : ${h.organisationName}
Address : ${h.address || "Not Available"}
Phone : ${h.phone || "Not Available"}
`).join("\n")}

Departments:

${departments
            .map(d => d.departmentName)
            .join(", ")}

Doctors:

${doctors
            .map(d => `
${d.name}
Specialization : ${d.specialization}
Experience : ${d.experience} years
`)
            .join("\n")}

Rules:

- Never invent hospitals.
- Never invent doctors.
- Never invent departments.
- Never invent appointments.
- Only answer questions related to MediToken and the hospitals listed on the platform.
- If information is unavailable in the provided data, clearly say you don't know.
`;

    return await askGemini(
        message,
        context
    );

};

// ===========================================
// Appointment Query Handler
// ===========================================

const handleAppointmentQuery = async (
    user,
    intentData
) => {

    if (!user) {

        return "Please login to view your appointments.";

    }

    const { date } = intentData;

    // -------------------------
    // TODAY
    // -------------------------

    if (date === "today") {

        if (!user) {
            return "Please login to book an appointment.";
        }

        const appointments =
            await getTodayAppointments(user._id);

        if (!appointments.length) {

            return "You have no appointments today.";

        }

        return `Your appointments for today:\n\n${formatAppointments(
            appointments
        )}`;

    }

    // -------------------------
    // TOMORROW
    // -------------------------

    if (date === "tomorrow") {

        const appointments =
            await getTomorrowAppointments(user._id);

        if (!appointments.length) {

            return "You have no appointments tomorrow.";

        }

        return `Your appointments for tomorrow:\n\n${formatAppointments(
            appointments
        )}`;

    }

    // -------------------------
    // NEXT APPOINTMENT
    // -------------------------

    if (
        intentData.intent === "NEXT_APPOINTMENT" ||
        intentData.nextAppointment === true
    ) {

        const appointment =
            await getNextAppointment(user._id);

        if (!appointment) {

            return "You have no upcoming appointments.";

        }

        return `Your next appointment is:

Doctor : ${appointment.doctorId?.name}

Department : ${appointment.doctorId?.specialization}

Hospital : ${appointment.vendorId?.organisationName ||
            "N/A"
            }

Date : ${new Date(
                appointment.appointmentDateTime
            ).toLocaleDateString("en-IN")}

Time : ${appointment.appointmentTime}

Token : ${appointment.tokenNumber}`;

    }

    // -------------------------
    // ALL UPCOMING
    // -------------------------

    const appointments =
        await getUpcomingAppointments(user._id);

    if (!appointments.length) {

        return "You have no upcoming appointments.";

    }

    return `Here are your upcoming appointments:

${formatAppointments(
        appointments
    )}`;

};

// ===========================================
// Doctor Query Handler
// ===========================================

const handleDoctorQuery = async (
    entityData
) => {

    if (!entityData.doctor) {

        return "Please specify the doctor's name.";

    }

    return await getDoctorInfo(
        entityData.doctor
    );

};

// ===========================================
// Department Query Handler
// ===========================================

const handleDepartmentQuery = async (
    entityData
) => {

    if (!entityData.department) {

        return "Please specify the department.";

    }

    return await getDepartmentInfo(
        entityData.department
    );

};

// ===========================================
// Greeting Handler
// ===========================================

const handleGreeting = () => {

    return `Hello 👋

Welcome to MediToken.

I can help you with:

• Book appointments

• Cancel appointments

• Reschedule appointments

• Check today's appointments

• Check tomorrow's appointments

• Find doctors

• Department information

How may I assist you today?`;

};

// ===========================================
// Book Appointment Handler
// ===========================================


const handleBookAppointment = async (user, entityData) => {

    if (!user) {
        return "Please login to book an appointment.";
    }

    const memory = getMemory(user._id) || {};

    // -------------------------------
    // STEP 1 : Department
    // -------------------------------

    if (!entityData.department && !memory.department) {

        const departments = await Department.find({
            status: "active"
        }).select("departmentName");

        saveMemory(user._id, {
            intent: "BOOK_APPOINTMENT",
            step: "department"
        });

        return {
            reply: "🏥 Which department would you like to visit?",
            type: "options",
            optionType: "department",
            options: departments.map(d => d.departmentName)
        };
    }

    // Save department if newly selected
    if (entityData.department && !memory.department) {

        saveMemory(user._id, {
            department: entityData.department,
            step: "doctor"
        });

    }

    const department =
        entityData.department || memory.department;

    // -------------------------------
    // STEP 2 : Doctor
    // -------------------------------

    if (!entityData.doctor && !memory.doctor) {

        const doctors = await Doctor.find({
            specialization: {
                $regex: `^${department}$`,
                $options: "i"
            },
            status: "active"
        }).select("name");

        return {
            reply: `👨‍⚕️ Available doctors in ${department}:`,
            type: "options",
            optionType: "doctor",
            options: doctors.map(d => d.name)
        };
    }

    // Save doctor
    if (entityData.doctor && !memory.doctor) {

        saveMemory(user._id, {
            doctor: entityData.doctor,
            step: "date"
        });

    }

    const doctorName =
        entityData.doctor || memory.doctor;

    const doctor = await findDoctor(doctorName);

    if (!doctor) {

        return "Doctor not found.";

    }

    // -------------------------------
    // STEP 3 : Date
    // -------------------------------

    if (!entityData.date && !memory.date) {

        return {
            reply: "📅 Select an appointment date",
            type: "options",
            optionType: "date",
            options: [
                "Today",
                "Tomorrow",
                "📅 Choose Another Date"
            ]
        };

    }

    if (entityData.date && !memory.date) {

        saveMemory(user._id, {
            date: entityData.date,
            step: "time"
        });

    }

    const date = normalizeDate(
        entityData.date || memory.date
    );
    // -------------------------------
    // STEP 4 : Time
    // -------------------------------

    if (!entityData.time && !memory.time) {

        const slots = await getAvailableSlots(
            doctor._id,
            date
        );

        if (!slots.length) {

            // Remove the invalid date from memory
            saveMemory(user._id, {
                ...getMemory(user._id),
                date: null,
                step: "date"
            });

            return {
                reply:
                    "❌ This doctor is not available on the selected date.\n\nPlease choose another date.",
                type: "options",
                optionType: "date",
                options: [
                    "Today",
                    "Tomorrow",
                    "📅 Choose Another Date"
                ]
            };
        }
    }

    if (entityData.time && !memory.time) {

        saveMemory(user._id, {
            time: entityData.time,
            step: "confirm"
        });

    }

    const time =
        entityData.time || memory.time;

    const confirmed =
        entityData.confirm || false;

    // -------------------------------
    // STEP 5 : Confirmation
    // -------------------------------

    if (!confirmed) {

        saveMemory(user._id, {
            confirm: true
        });

        return {
            reply: `Please confirm your appointment.

👨‍⚕️ Doctor: ${doctor.name}

🏥 Department: ${doctor.specialization}

📅 Date: ${date}

🕒 Time: ${time}`,

            type: "options",
            optionType: "confirm",
            options: [
                "Confirm",
                "Cancel"
            ]
        };
    }

    // Check that the selected slot is still available
    const availableSlots = await getAvailableSlots(
        doctor._id,
        date
    );

    if (!availableSlots.includes(time)) {
        return {
            reply:
                "❌ That time slot is no longer available. Please choose another slot.",
            type: "options",
            optionType: "slot",
            options: availableSlots
        };
    }

    const result = await bookAppointment({
        user,
        doctor,
        date,
        time
    });

    if (!result.success) {
        return result.message;
    }

    clearMemory(user._id);

    return {

        reply: "✅ Appointment booked successfully.",

        type: "appointment",

        appointment: {

            doctor: doctor.name,

            department: doctor.specialization,

            date: new Date(
                result.appointment.appointmentDateTime
            ).toLocaleDateString("en-IN"),

            time: result.appointment.appointmentTime,

            token: result.appointment.tokenNumber

        }

    };

};

// ===========================================
// Cancel Appointment Handler
// ===========================================

const handleCancelAppointment = async (
    user,
    appointmentId = null,
    confirm = false
) => {
    console.log("handleCancelAppointment");
    console.log({
        appointmentId,
        confirm
    });

    if (!user) {
        return "Please login first.";
    }

    // =====================================
    // STEP 1: Show appointment list
    // =====================================

    if (!appointmentId) {

        const appointments = await Appointment.find({
            patientId: user._id,
            status: "booked",
            appointmentDateTime: { $gte: new Date() }
        })
            .populate("doctorId", "name specialization")
            .sort({ appointmentDateTime: 1 });

        if (!appointments.length) {
            return "You have no upcoming appointments to cancel.";
        }

        if (appointments.length === 1) {
            appointmentId = appointments[0]._id;
        } else {

            return {
                type: "cancel_selection",
                reply: "Please select the appointment you want to cancel.",
                appointments: appointments.map(appt => ({
                    appointmentId: appt._id,
                    doctor: appt.doctorId.name,
                    department: appt.doctorId.specialization,
                    date: new Date(appt.appointmentDateTime)
                        .toLocaleDateString("en-GB"),
                    time: appt.appointmentTime,
                    token: appt.tokenNumber
                }))
            };
        }
    }

    // =====================================
    // STEP 2: Ask confirmation
    // =====================================

    if (!confirm) {

        const appointment = await Appointment.findById(appointmentId)
            .populate("doctorId", "name specialization");

        if (!appointment) {
            return "Appointment not found.";
        }

        return {
            type: "confirm_cancel",
            reply: "Are you sure you want to cancel this appointment?",

            // ✅ Top-level appointmentId
            appointmentId: appointment._id,

            appointment: {
                doctor: appointment.doctorId.name,
                department: appointment.doctorId.specialization,
                date: new Date(appointment.appointmentDateTime)
                    .toLocaleDateString("en-GB"),
                time: appointment.appointmentTime,
                token: appointment.tokenNumber
            }
        };
    }

    // =====================================
    // STEP 3: Cancel appointment
    // =====================================

    const appointment = await Appointment.findById(appointmentId)
        .populate("doctorId", "name specialization");

    if (!appointment) {
        return "Appointment not found.";
    }

    appointment.status = "cancelled";

    await appointment.save();

    clearMemory(user._id);

    return {
        type: "text",
        reply:
            `✅ Appointment cancelled successfully.

Doctor: ${appointment.doctorId.name}

Department: ${appointment.doctorId.specialization}

Date: ${new Date(
                appointment.appointmentDateTime
            ).toLocaleDateString("en-GB")}

Time: ${appointment.appointmentTime}

Token: #${appointment.tokenNumber}`
    };
};


// ===========================================
// Reschedule Appointment Handler
// ===========================================

const handleRescheduleAppointment = async (
    user,
    entityData
) => {

    if (!user) {

        return "Please login first.";

    }

    if (!entityData.date) {

        return "Please provide the new appointment date.";

    }

    if (!entityData.time) {

        return "Please provide the new appointment time.";

    }

    const result =
        await rescheduleAppointment(

            user._id,

            entityData.date,

            entityData.time

        );

    if (!result) {

        return "You have no appointment to reschedule.";

    }

    if (!result.success) {

        return result.message;

    }
    clearMemory(user._id);

    return `✅ Appointment rescheduled successfully.

New Date : ${new Date(
        result.appointment.appointmentDateTime
    ).toLocaleDateString("en-IN")}

New Time : ${result.appointment.appointmentTime}

New Token : ${result.appointment.tokenNumber}`;

};

// ===========================================
// Unknown Intent Handler
// ===========================================

const handleUnknownIntent = () => {
    return {
        reply:
            "I'm sorry, I couldn't understand your request.\n\nPlease choose one of the options below or rephrase your request.",

        type: "options",

        options: [
            {
                label: "📅 Book Appointment",
                action: "BOOK_APPOINTMENT"
            },
            {
                label: "📋 My Appointments",
                action: "MY_BOOKINGS"
            },
            {
                label: "🕒 Track Token",
                action: "TRACK_TOKEN"
            },
            {
                label: "❌ Cancel Appointment",
                action: "CANCEL_APPOINTMENT"
            }
        ]
    };
};

module.exports = {
    handleUnknownIntent
};


// ===========================================
// Process User Message
// ===========================================

const processUserMessage = async (
    payload,
    user = null
) => {

    const {
        message = "",
        action = null,
        department = null,
        doctor = null,
        date = null,
        time = null,
        appointmentId = null
    } = payload;

    try {

        // =========================================
        // HANDLE UI ACTIONS (NO INTENT DETECTION)
        // =========================================

        if (action) {

            if (!user) {
                return "Please login to continue.";
            }

            const memory = getMemory(user._id) || {};

            switch (action) {
                case "BOOK_APPOINTMENT":

                    clearMemory(user._id);

                    saveMemory(user._id, {
                        intent: "BOOK_APPOINTMENT",
                        step: "department"
                    });

                    return await handleBookAppointment(user, {});


                case "TRACK_TOKEN": {

                    const result = await handleTrackToken(user);

                    if (result.type === "appointment_selection") {

                        saveMemory(user._id, {
                            ...(getMemory(user._id) || {}),
                            awaitingAppointmentId: true
                        });
                    }

                    return result;
                }


                case "CANCEL_APPOINTMENT":

                    clearMemory(user._id);

                    return await handleCancelAppointment(user);

                case "SELECT_DEPARTMENT":

                    saveMemory(user._id, {
                        ...memory,
                        intent: "BOOK_APPOINTMENT",
                        department,
                        step: "doctor"
                    });

                    return await handleBookAppointment(user, {
                        department
                    });

                case "SELECT_DOCTOR":

                    saveMemory(user._id, {
                        ...memory,
                        doctor,
                        step: "date"
                    });

                    return await handleBookAppointment(user, {
                        department: memory.department,
                        doctor
                    });

                case "SELECT_DATE":

                    saveMemory(user._id, {
                        ...memory,
                        date,
                        step: "time"
                    });

                    return await handleBookAppointment(user, {
                        department: memory.department,
                        doctor: memory.doctor,
                        date
                    });

                case "SELECT_SLOT":

                    saveMemory(user._id, {
                        ...memory,
                        time,
                        step: "confirm"
                    });

                    return await handleBookAppointment(user, {
                        department: memory.department,
                        doctor: memory.doctor,
                        date: memory.date,
                        time
                    });

                case "CONFIRM_BOOKING":

                    return await handleBookAppointment(user, {
                        department: memory.department,
                        doctor: memory.doctor,
                        date: memory.date,
                        time: memory.time,
                        confirm: true
                    });

                case "TRACK_APPOINTMENT":
                    return await handleTrackToken(user, appointmentId);

                case "CANCEL_BOOKING":
                    clearMemory(user._id);
                    return "Appointment booking cancelled.";


                case "SELECT_CANCEL_APPOINTMENT":

                    return await handleCancelAppointment(
                        user,
                        appointmentId
                    );

                case "CONFIRM_CANCEL":

                    console.log("CONFIRM_CANCEL received");
                    console.log("appointmentId:", appointmentId);

                    return await handleCancelAppointment(
                        user,
                        appointmentId,
                        true
                    );

                case "CANCEL_CANCEL":

                    return "Appointment cancellation cancelled.";

                case "MY_BOOKINGS":
                    return await handleMyBookings(user);

                default:
                    return "Invalid action.";
            }
        }

        if (user) {

            const memory = getMemory(user._id) || {};

            if (memory.awaitingAppointmentId) {

                memory.awaitingAppointmentId = false;
                saveMemory(user._id, memory);

                return await handleTrackToken(user, message.trim());
            }
        }

        // =========================================
        // DETECT INTENT
        // =========================================

        const intentData = await detectIntent(message);

        console.log("Intent:", intentData);

        // =========================================
        // EXTRACT ENTITIES ONLY WHEN REQUIRED
        // =========================================

        let entityData = {};

        const intentsNeedingEntities = [
            "BOOK_APPOINTMENT",
            "DOCTOR_INFO",
            "DEPARTMENT_INFO",
            "RESCHEDULE_APPOINTMENT"
        ];

        if (intentsNeedingEntities.includes(intentData.intent)) {
            entityData = await extractEntities(message);
        }

        console.log("Entities:", entityData);

        const data = {
            ...intentData,
            ...entityData
        };

        // =========================================
        // RESTORE MEMORY
        // =========================================

        if (user) {

            const memory = getMemory(user._id) || {};

            if (!data.department) data.department = memory.department;
            if (!data.doctor) data.doctor = memory.doctor;
            if (!data.date) data.date = memory.date;
            if (!data.time) data.time = memory.time;

            if (
                memory.intent === "BOOK_APPOINTMENT" &&
                intentData.intent === "GENERAL_QUERY"
            ) {
                data.intent = "BOOK_APPOINTMENT";
            }

            if (
                memory.intent === "RESCHEDULE_APPOINTMENT" &&
                intentData.intent === "GENERAL_QUERY"
            ) {
                data.intent = "RESCHEDULE_APPOINTMENT";
            }
        }

        // =========================================
        // GREETING
        // =========================================

        switch (data.intent) {

            case "GREETING":

                clearMemory(user?._id);

                return handleGreeting();

            case "GET_APPOINTMENTS":

            case "NEXT_APPOINTMENT":

                return await handleAppointmentQuery(
                    user,
                    data
                );

            case "BOOK_APPOINTMENT":
                if (!user) {
                    return "Please login to book an appointment.";
                }

                if (
                    message.trim().toLowerCase() === "book appointment" ||
                    message.trim().toLowerCase() === "book" ||
                    message.trim().toLowerCase() === "appointment"
                ) {

                    clearMemory(user._id);

                    saveMemory(user._id, {
                        intent: "BOOK_APPOINTMENT",
                        step: "department"
                    });

                    data.department = null;
                    data.doctor = null;
                    data.date = null;
                    data.time = null;
                }

                return await handleBookAppointment(
                    user,
                    data
                );

            case "TRACK_TOKEN": {

                const result = await handleTrackToken(user);

                if (result.type === "appointment_selection") {

                    const memory = getMemory(user._id) || {};

                    saveMemory(user._id, {
                        ...memory,
                        awaitingAppointmentId: true
                    });
                }

                return result;
            }

            case "CANCEL_APPOINTMENT":
                clearMemory(user._id);
                return await handleCancelAppointment(user);

            case "SELECT_CANCEL_APPOINTMENT":

                return await handleCancelAppointment(
                    user,
                    appointmentId
                );

            case "CONFIRM_CANCEL":

                return await handleCancelAppointment(
                    user,
                    appointmentId,
                    true
                );

            case "CANCEL_CANCEL":

                return "Appointment cancellation cancelled.";

            case "RESCHEDULE_APPOINTMENT":

                return await handleRescheduleAppointment(
                    user,
                    data
                );

            case "DOCTOR_INFO":

                return await handleDoctorQuery(data);

            case "DEPARTMENT_INFO":

                return await handleDepartmentQuery(data);

            case "GENERAL_QUERY": {
                try {
                    const reply = await askGemini(message);
                    return reply;
                } catch (err) {
                    console.error("Gemini failed:", err.message);

                    return {
                        reply: `I'm sorry, I couldn't answer that right now.

I can still help you with:

• Book Appointment
• Cancel Appointment
• Reschedule Appointment
• Track Token
• Today's Appointments
• Tomorrow's Appointments
• Doctor Information
• Department Information

How may I assist you today?`,
                        quickReplies: [
                            "Book Appointment",
                            "Track Token",
                            "Today's Appointments",
                            "Cancel Appointment"
                        ]
                    };
                }
            }

            case "THANK_YOU":
                return {
                    reply: "You're welcome! 😊 Is there anything else I can help you with today?",
                    options: [
                        { label: "📅 Book Appointment", action: "BOOK_APPOINTMENT" },
                        { label: "📋 My Appointments", action: "MY_BOOKINGS" },
                        { label: "🕒 Track Token", action: "TRACK_TOKEN" },
                        { label: "❌ Cancel Appointment", action: "CANCEL_APPOINTMENT" }
                    ]
                };


            case "END_CONVERSATION":
                clearMemory(user?._id);

                return {
                    reply: "You're welcome! 😊 If you need any help later, feel free to chat with me. Have a great day! 👋"
                };

            case "GOODBYE":
                clearMemory(user?._id);

                return {
                    reply: "Thank you for using MediToken. Have a great day! 👋"
                };

            case "AFFIRMATIVE":
                return {
                    reply: "Great! 😊 What would you like to do?",
                    options: [
                        { label: "📅 Book Appointment", action: "BOOK_APPOINTMENT" },
                        { label: "📋 My Appointments", action: "MY_BOOKINGS" },
                        { label: "🕒 Track Token", action: "TRACK_TOKEN" },
                        { label: "❌ Cancel Appointment", action: "CANCEL_APPOINTMENT" }
                    ]
                };

            default:

                return handleUnknownIntent();

        }

    } catch (err) {

        console.error("========== AI ERROR ==========");
        console.error(err);
        console.error(err.stack);

        return "Sorry, something went wrong while processing your request.";
    }
};



const handleTrackToken = async (user, appointmentId = null) => {

    if (!user) {
        return "Please login to track your token.";
    }

    // ----------------------------------------
    // STEP 1: Ask user to choose appointment
    // ----------------------------------------
    if (!appointmentId) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointments = await Appointment.find({
            patientId: user._id,
            status: { $in: ["booked", "serving"] },
            appointmentDateTime: { $gte: today }
        })
            .populate("doctorId", "name specialization")
            .sort({ appointmentDateTime: 1 });

        if (!appointments.length) {
            return "You don't have any active appointments.";
        }

        if (appointments.length === 1) {
            appointmentId = appointments[0]._id;
        } else {

            return {
                type: "appointment_selection",
                reply: "You have multiple active appointments. Please select one to track.",
                appointments: appointments.map(appt => ({
                    appointmentId: appt._id,
                    doctor: appt.doctorId.name,
                    department: appt.doctorId.specialization,
                    date: new Date(appt.appointmentDateTime).toLocaleDateString("en-GB"),
                    time: appt.appointmentTime,
                    token: appt.tokenNumber
                }))
            };
        }
    }

    // ----------------------------------------
    // STEP 2: Load appointment
    // ----------------------------------------

    const appointment = await Appointment.findById(appointmentId)
        .populate("doctorId", "name specialization")
        .populate("vendorId", "organisationName");

    if (!appointment) {
        return "Invalid Appointment ID.";
    }

    // ----------------------------------------
    // STEP 3: SAME LOGIC AS MANUAL TRACK TOKEN
    // ----------------------------------------

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

    const currentServing = await Appointment.findOne({
        doctorId: appointment.doctorId._id,
        appointmentDateTime: {
            $gte: start,
            $lte: end
        },
        status: "serving"
    }).sort({ appointmentDateTime: 1 });

    const currentToken = currentServing
        ? currentServing.tokenNumber
        : 0;

    // ----------------------------------------
    // STEP 4: ESTIMATED WAIT
    // ----------------------------------------

    const now = new Date();

    let estimatedWait = Math.floor(
        (appointment.appointmentDateTime.getTime() - now.getTime()) /
        (1000 * 60)
    );

    if (estimatedWait < 0) {
        estimatedWait = 0;
    }

    let estimatedWaitText;

    if (estimatedWait < 60) {
        estimatedWaitText = `${estimatedWait} mins`;
    } else {
        const hours = Math.floor(estimatedWait / 60);
        const minutes = estimatedWait % 60;

        estimatedWaitText =
            minutes === 0
                ? `~${hours}h`
                : `~${hours}h ${minutes}m`;
    }
    // ----------------------------------------
    // STEP 5: RETURN
    // ----------------------------------------

    return {
        reply: "🎫 Your Token Status",
        type: "token",
        token: {
            appointmentId: appointment._id,
            doctor: appointment.doctorId.name,
            department: appointment.doctorId.specialization,
            token: appointment.tokenNumber,
            currentToken,
            patientsAhead,
            estimatedWait: estimatedWaitText,
            status: appointment.status
        }
    };
};

const handleMyBookings = async (user) => {

    if (!user) {
        return "Please login to view your bookings.";
    }

    const appointments = await Appointment.find({
        patientId: user._id
    })
        .populate("doctorId", "name specialization")
        .populate("vendorId", "organisationName")
        .sort({ appointmentDateTime: -1 });

    if (!appointments.length) {
        return {
            type: "text",
            reply: "You don't have any bookings yet."
        };
    }

    return {
        type: "my_bookings",
        reply: "Here are your bookings:",
        appointments: appointments.map(appt => ({
            appointmentId: appt._id,
            doctor: appt.doctorId?.name,
            department: appt.doctorId?.specialization,
            hospital: appt.vendorId?.organisationName,
            date: new Date(appt.appointmentDateTime)
                .toLocaleDateString("en-GB"),
            time: appt.appointmentTime,
            token: appt.tokenNumber,
            status: appt.status
        }))
    };
};


module.exports = {
    processUserMessage, handleTrackToken, handleMyBookings
};