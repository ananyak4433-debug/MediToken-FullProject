// const Patient = require('../models/patientModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

// // Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '2d' });
// };

// /* ================= REGISTER ================= */
// exports.registerPatient = async (req, res) => {
//   try {
//     const { name, email, password, phone, age, gender } = req.body;

//     const existingPatient = await Patient.findOne({ email });
//     if (existingPatient) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     const patient = await Patient.create({ name, email, password, phone, age, gender });

//     const token = generateToken(patient._id);

//     // Store JWT in HTTP-only cookie
//     res.cookie("patientToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // true only in production (HTTPS)
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(201).json({
//       success: true,
//       message: "Patient registered successfully",
//       patient: {
//         _id: patient._id,
//         name: patient.name,
//         email: patient.email,
//         phone: patient.phone,
//         age: patient.age,
//         gender: patient.gender,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= LOGIN ================= */
// exports.loginPatient = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const patient = await Patient.findOne({ email });
//     if (!patient) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await patient.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = generateToken(patient._id);

//     res.cookie("patientToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       patient: {
//         _id: patient._id,
//         name: patient.name,
//         email: patient.email,
//         phone: patient.phone,
//         age: patient.age,
//         gender: patient.gender,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= GET PROFILE ================= */
// exports.getPatientProfile = async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.user._id).select('-password');
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.status(200).json({ success: true, patient });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// /* ================= GET ALL PATIENTS ================= */
// exports.getAllPatients = async (req, res) => {
//   try {
//     const patients = await Patient.find()
//       .select('-password')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: patients.length,
//       patients
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* ================= LOGOUT ================= */
// exports.logoutPatient = async (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully"
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };




const Patient = require("../models/patientModel");
const jwt = require("jsonwebtoken");

// ================= Generate JWT =================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.SECRET_KEY,
    { expiresIn: "2d" }
  );
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
};

// ================= REGISTER =================
exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender } = req.body;

    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const patient = await Patient.create({
      name,
      email,
      password,
      phone,
      age,
      gender,
    });

    const token = generateToken(patient._id);

    res.cookie("patientToken", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      patient: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= LOGIN =================
exports.loginPatient = async (req, res) => {

  try {

    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await patient.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(patient._id);

    res.cookie("patientToken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      patient: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= GET PROFILE =================
exports.getPatientProfile = async (req, res) => {

  try {

    const patient = await Patient.findById(req.user._id).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= GET ALL PATIENTS =================
exports.getAllPatients = async (req, res) => {

  try {

    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= LOGOUT =================
exports.logoutPatient = async (req, res) => {

  try {

    res.clearCookie("patientToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};