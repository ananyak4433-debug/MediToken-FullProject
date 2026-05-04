const express = require("express");
const router = express.Router();

const adminProtect  = require("../middleware/adminAuthMiddleware");
const vendorProtect = require("../middleware/vendorAuthMiddleware");

const {
  createSupportRequest,
  getMyRequests,
  getAllRequests,
  updateStatus,
  replyToRequest,
  deleteRequest
} = require("../controllers/supportRequestController");

// Vendor routes
router.post("/vendor/support/create",   vendorProtect, createSupportRequest);
router.get("/vendor/support/my",        vendorProtect, getMyRequests);

// Admin routes
router.get("/admin/support/getall",     adminProtect, getAllRequests);
router.put("/admin/support/:id/status", adminProtect, updateStatus);
router.post("/admin/support/:id/reply", adminProtect, replyToRequest);
router.delete("/admin/support/:id",     adminProtect, deleteRequest);

module.exports = router;