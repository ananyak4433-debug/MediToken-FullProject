const Staff = require("../models/staffModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const sendToken = (res, staff, statusCode = 200) => {
  const token = jwt.sign(
    { id: staff._id, role: "staff" },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.cookie("staffToken", token, {
    httpOnly: true,
    secure: false,          // true in production (HTTPS)
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    success: true,
    _id: staff._id,
    email: staff.email,
    name: staff.firstName
  });
};



exports.staffSignup = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = await Staff.create({
      email,
      password: hashedPassword,
      vendorId: req.vendor._id,   // ✅ CRITICAL FIX
      ...rest
    });

    sendToken(res, staff, 201);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendToken(res, staff);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getStaffProfile = async (req, res) => {
  try {
    res.status(200).json(req.user); // from middleware
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};



exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find({
      vendorId: req.vendor._id
    }).sort({ createdAt: -1 }); 

    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json(staff);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};



exports.updateStaff = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updated = await Staff.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendor._id }, // ✅ scope to vendor
      updates,
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Staff not found or unauthorized" });
    }

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: "Failed to update staff" });
  }
};



exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.vendor._id // ✅ scope to vendor
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found or unauthorized" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete staff" });
  }
};




exports.staffLogout = async (req, res) => {
  res.cookie("staffToken", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: "Logged out successfully" });
};