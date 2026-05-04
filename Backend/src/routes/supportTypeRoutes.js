const express = require("express");
const router = express.Router();

const adminProtect = require("../middleware/adminAuthMiddleware");

const {
  createSupportType,
  getAllSupportTypes,
  updateSupportType,
  deleteSupportType
} = require("../controllers/supportTypeController");

router.post("/admin/support-types/create", adminProtect, createSupportType);
router.get("/admin/support-types/getall", getAllSupportTypes);
router.put("/admin/support-types/:id", adminProtect, updateSupportType);
router.delete("/admin/support-types/delete/:id", adminProtect, deleteSupportType);

// router.get("/admin/support-types/getall",        getAllSupportTypes); 

module.exports = router;