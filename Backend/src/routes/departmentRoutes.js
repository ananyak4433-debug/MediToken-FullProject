const express = require("express");
const router = express.Router();

const adminProtect = require("../middleware/adminAuthMiddleware");

const {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
  updateDepartment
} = require("../controllers/departmentController");

router.post("/admin/departments/create", adminProtect, createDepartment);
router.get("/admin/departments/getall",  getAllDepartments);
router.delete("/admin/departments/delete/:id", adminProtect, deleteDepartment);
router.put('/admin/departments/:id', adminProtect, updateDepartment);

module.exports = router;