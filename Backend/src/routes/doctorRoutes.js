const express = require("express");
const router = express.Router();
const {
  getDoctorProfile, getMyDoctors, createDoctor,
  updateDoctor, deleteDoctor, updateAvailability,getPublicDoctors
} = require("../controllers/doctorController");
const staffOrVendor = require("../middleware/doctorAuthMiddleware"); // ✅ handles both

router.get("/doctors/public", getPublicDoctors);
router.get("/doctors/allDoctors",          staffOrVendor, getMyDoctors);
router.get("/doctors/:id",                 staffOrVendor, getDoctorProfile);
router.post("/doctors/create",             staffOrVendor, createDoctor);
router.put("/doctors/:id",                 staffOrVendor, updateDoctor);
router.delete("/doctors/:id",              staffOrVendor, deleteDoctor);
router.put("/doctors/:id/availability",    staffOrVendor, updateAvailability);


module.exports = router;