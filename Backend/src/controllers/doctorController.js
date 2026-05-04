const Doctor = require("../models/doctorCollection");

/* ================= HELPER — works for both staff and vendor ================= */
const getOwnerId = (req) => {
  if (req.vendor) return { vendorId: req.vendor._id };
  if (req.user)   return { staffId: req.user._id };
  return {};
};


/* ================= GET ALL DOCTORS ================= */
exports.getMyDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find(getOwnerId(req))
      .sort({ createdAt: -1 }); 
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE DOCTOR ================= */
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, ...getOwnerId(req) }); // ✅
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE DOCTOR ================= */
exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,
      ...getOwnerId(req)  // ✅ saves either vendorId or staffId
    });
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE DOCTOR ================= */
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.params.id, ...getOwnerId(req) }, // ✅
      { ...req.body },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE DOCTOR ================= */
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({
      _id: req.params.id,
      ...getOwnerId(req)  // ✅
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE AVAILABILITY ================= */
exports.updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      ...getOwnerId(req)  // ✅
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    doctor.availability = req.body.availability;
    await doctor.save();
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.getPublicDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find({ status: "active" })
//       .populate("vendorId", "organisationName address phone"); // ✅ get hospital details
//       console.log('🏥 First doctor vendorId:', doctors[0]?.vendorId);
//     res.json({ success: true, data: doctors });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



exports.getPublicDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'active' })
      .populate('vendorId', 'organisationName address phone')
      .populate({
        path: 'staffId',
        select: 'vendorId',
        populate: {
          path: 'vendorId',
          select: 'organisationName address phone'
        }
      });

    // ✅ Normalize — attach vendorId from staffId if missing
    const normalized = doctors.map(doc => {
      const d = doc.toObject();
      if (!d.vendorId && d.staffId?.vendorId) {
        d.vendorId = d.staffId.vendorId;  // ✅ use vendor from staff's vendorId
      }
      return d;
    });

    res.json({ success: true, data: normalized });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};