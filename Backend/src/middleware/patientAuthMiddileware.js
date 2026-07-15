

// const jwt = require("jsonwebtoken");
// const Patient = require("../models/patientModel");

// const patientProtect = async (req, res, next) => {
//   try {
//     // Read token from cookie
//     const token = req.cookies?.patientToken;

//     if (!token) {
//       return res.status(401).json({
//         message: "Not authorized, no token",
//       });
//     }

//     // Verify JWT
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//     // Find patient
//     req.user = await Patient.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(401).json({
//         message: "Patient not found",
//       });
//     }

//     next();
//   } catch (error) {
//     console.error(error);

//     return res.status(401).json({
//       message: "Not authorized, token failed",
//     });
//   }
// };


// module.exports = patientProtect;



const jwt = require("jsonwebtoken");
const Patient = require("../models/patientModel");

const patientProtect = async (req, res, next) => {
  try {
    const token = req.cookies.patientToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const patient = await Patient.findById(decoded.id).select("-password");

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Patient not found",
      });
    }

    req.user = patient;

    next();
  } catch (error) {
    console.error("Patient Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

module.exports = patientProtect;