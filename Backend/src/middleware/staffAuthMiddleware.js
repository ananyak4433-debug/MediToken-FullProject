
const jwt = require("jsonwebtoken");
const Staff = require("../models/staffModel");

const staffProtect = async (req, res, next) => {
  try {
    const token = req.cookies.staffToken;

    if (!token) {
      return next(new Error("No staff token")); // ✅ pass error, don't respond
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "staff") {
      return next(new Error("Not staff role")); // ✅ same here
    }

    const staff = await Staff.findById(decoded.id).select("-password");

    if (!staff) {
      return next(new Error("Staff not found")); // ✅ same here
    }

    req.user = staff;
    next(); // ✅ no error = success

  } catch (error) {
    return next(error); // ✅ catch block too
  }
};

module.exports = staffProtect;