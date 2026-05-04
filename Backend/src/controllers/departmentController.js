const Department = require("../models/departmentModel");

/* ================= ADD DEPARTMENT ================= */
exports.createDepartment = async (req, res) => {
  try {
    const { departmentName, description, status } = req.body;

    if (!departmentName) {
      return res.status(400).json({
        success: false,
        message: "Department name is required"
      });
    }

    const existingDepartment = await Department.findOne({ departmentName });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      departmentName,
      description,
      status,
      createdBy: req.adminId
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/* ================= GET ALL DEPARTMENTS ================= */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalDepartments: departments.length,
      departments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/* ================= DELETE DEPARTMENT ================= */
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



/* ================= UPDATE DEPARTMENT ================= */
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentName, description, status } = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      { departmentName, description, status },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department updated successfully', department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};