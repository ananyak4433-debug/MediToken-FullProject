const Admin = require("../models/adminModels");
const Vendor = require("../models/vendorModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= ADMIN SIGNUP ================= */
exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= ADMIN LOGIN ================= */
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (admin.status !== "active") {
            return res.status(403).json({
                message: "Admin account is inactive or blocked"
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: false
        });

        res.status(200).json({
            success: true,
            message: "Admin login successful"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= ADMIN PROFILE ================= */
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            success: true,
            admin
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/* ================= ADMIN DASHBOARD STATS ================= */
exports.getAdminDashboard = async (req, res) => {
    try {
        // Total counts
        const totalVendors = await Vendor.countDocuments();
        const totalStaff = await Staff.countDocuments();
        const totalPatients = await Patient.countDocuments();
        const totalAppointments = await Appointment.countDocuments();

        // Today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointments = await Appointment.countDocuments({
            bookedAt: {
                $gte: today,
                $lt: tomorrow
            }
        });

        res.status(200).json({
            success: true,
            dashboard: {
                totalVendors,
                totalStaff,
                totalPatients,
                totalAppointments,
                todayAppointments
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};



/* ================= GET ALL APPOINTMENTS (ADMIN - PAGINATED) ================= */
exports.getAllAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 10, vendorId, status, date } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        let filter = {};

        // Filter by vendor
        if (vendorId) {
            filter.vendorId = vendorId;
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by specific date
        if (date) {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);

            filter.bookedAt = {
                $gte: selectedDate,
                $lt: nextDay
            };
        }

        // Total count for pagination metadata
        const totalAppointments = await Appointment.countDocuments(filter);

        // Fetch paginated results
        const appointments = await Appointment.find(filter)
            .populate("vendorId", "vendorName organisationName")
            .populate("patientId", "name phone")
            .populate("staffId", "email")
            .sort({ bookedAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalAppointments / limitNumber),
                totalAppointments,
                pageSize: limitNumber
            },
            appointments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};