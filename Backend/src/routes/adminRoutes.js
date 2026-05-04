const express = require("express");
const {
    adminSignup,
    adminLogin,
    getAdminProfile,
    getAllAppointments,
    getAdminDashboard
} = require("../controllers/adminController");

const adminProtect = require("../middleware/adminAuthMiddleware");

const router = express.Router();

/* ================= AUTH ================= */
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.get("/admin/profile", adminProtect, getAdminProfile);
router.get("/admin/dashboard", adminProtect, getAdminDashboard);
router.get("/admin/appointments", adminProtect, getAllAppointments);

module.exports = router;
