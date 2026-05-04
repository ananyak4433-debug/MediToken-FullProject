console.log("STAFF ROUTES FILE IS LOADED");

const express = require("express");
const router = express.Router();

const {
  staffSignup,
  staffLogin,
  staffLogout,
  getStaffProfile,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} = require("../controllers/staffController");

const staffProtect = require("../middleware/staffAuthMiddleware");
const vendorProtect= require("../middleware/vendorAuthMiddleware")


router.post("/staff/signup", vendorProtect, staffSignup);
router.post("/staff/login", staffLogin);
router.post("/staff/logout", staffLogout);


router.get("/staff/profile", vendorProtect, getStaffProfile);


router.get("/staff/all", vendorProtect, getAllStaff);
router.get("/staff/:id", vendorProtect, getStaffById);
router.put("/staff/:id", vendorProtect, updateStaff);
router.delete("/staff/:id", vendorProtect, deleteStaff);


module.exports = router;