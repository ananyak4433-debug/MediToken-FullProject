const SupportRequest = require("../models/supportRequestModel");

/* ── VENDOR: Submit request ── */
exports.createSupportRequest = async (req, res) => {
  try {
    const { name, email, supportType, subject, message } = req.body;

    if (!name || !email || !supportType || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const request = await SupportRequest.create({
      vendor: req.vendor._id,
      name, email, supportType, subject, message
    });

    res.status(201).json({ success: true, message: "Support request submitted", request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ── VENDOR: Get own requests ── */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({ vendor: req.vendor._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ── ADMIN: Get all requests ── */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find()
      .populate("vendor", "name email hospitalName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ── ADMIN: Update status ── */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await SupportRequest.findByIdAndUpdate(
      id, { status }, { new: true }
    );

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    res.status(200).json({ success: true, message: "Status updated", request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ── ADMIN: Reply to request ── */
exports.replyToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) return res.status(400).json({ success: false, message: "Reply message is required" });

    const request = await SupportRequest.findByIdAndUpdate(
      id,
      { $push: { replies: { message, sentBy: "admin" } } },
      { new: true }
    );

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    res.status(200).json({ success: true, message: "Reply sent", request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ── ADMIN: Delete request ── */
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SupportRequest.findByIdAndDelete(id);

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    res.status(200).json({ success: true, message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};