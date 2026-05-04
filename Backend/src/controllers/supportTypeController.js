const SupportType = require("../models/supportTypeModel");

/* ================= CREATE SUPPORT TYPE ================= */
exports.createSupportType = async (req, res) => {
  try {
    const { typeName, description, status } = req.body;

    if (!typeName) {
      return res.status(400).json({
        success: false,
        message: "Support type name is required"
      });
    }

    const existing = await SupportType.findOne({ typeName });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Support type already exists"
      });
    }

    const supportType = await SupportType.create({
      typeName,
      description,
      status,
      createdBy: req.adminId
    });

    res.status(201).json({
      success: true,
      message: "Support type created successfully",
      supportType
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/* ================= GET ALL SUPPORT TYPES ================= */
exports.getAllSupportTypes = async (req, res) => {
  try {
    const supportTypes = await SupportType.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalSupportTypes: supportTypes.length,
      supportTypes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/* ================= UPDATE SUPPORT TYPE ================= */
exports.updateSupportType = async (req, res) => {
  try {
    const { id } = req.params;
    const { typeName, description, status } = req.body;

    const supportType = await SupportType.findByIdAndUpdate(
      id,
      { typeName, description, status },
      { new: true }
    );

    if (!supportType) {
      return res.status(404).json({
        success: false,
        message: "Support type not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Support type updated successfully",
      supportType
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/* ================= DELETE SUPPORT TYPE ================= */
exports.deleteSupportType = async (req, res) => {
  try {
    const { id } = req.params;

    const supportType = await SupportType.findByIdAndDelete(id);

    if (!supportType) {
      return res.status(404).json({
        success: false,
        message: "Support type not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Support type deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};