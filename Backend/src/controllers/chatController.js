const askGemini = require("../services/geminiServices");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patientModel");

const Doctor = require("../models/doctorCollection");
const Department = require("../models/departmentModel");
const Appointment = require("../models/appointmentModel");
const aiServices = require("../services/aiServicess");
// const hospitals = hospitalData.hospitals;

console.log(aiServices);
console.log(typeof aiServices.processUserMessage);

const { processUserMessage } = require("../services/aiServicess");

const chat = async (req, res) => {

    console.log("BODY:", req.body);

    try {

        const {
            message = "",
            action = null,
            department = null,
            doctor = null,
            date = null,
            time = null,
            appointmentId = null
        } = req.body

        if (!message && !action) {

            return res.status(400).json({
                success: false,
                message: "Message or action is required"
            });

        }

        let user = null;

        console.log("Cookies:", req.cookies);

        const token = req.cookies?.patientToken;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);

                user = await Patient.findById(decoded.id);

                console.log("Logged in user:", user);
            } catch (err) {
                console.log("Invalid token");
            }
        }
        const result = await processUserMessage(
            {
                message,
                action,
                department,
                doctor,
                date,
                time,
                appointmentId
            },
            user
        );

        if (typeof result === "string") {
            return res.json({
                success: true,
                reply: result,
                type: "text"
            });
        }

        return res.json({
            success: true,
            ...result
        });

    }
    catch (err) {

        if (err.status === 429) {
            return res.status(429).json({
                success: false,
                message: "AI service quota exceeded. Please try again later."
            });
        }

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

};

module.exports = {
    chat
};