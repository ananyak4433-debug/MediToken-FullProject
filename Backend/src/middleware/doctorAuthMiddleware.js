
const staffProtect = require("./staffAuthMiddleware");
const vendorProtect = require("./vendorAuthMiddleware");

const staffOrVendor = (req, res, next) => {
  // ✅ Try vendor FIRST — if vendorToken cookie exists, use it
  vendorProtect(req, res, (vendorErr) => {
    if (!vendorErr) return next();  // ✅ vendor authenticated

    // ✅ Fall back to staff if vendor fails
    staffProtect(req, res, (staffErr) => {
      if (!staffErr) return next();  // ✅ staff authenticated

      return res.status(403).json({ message: "Access denied: Staff or Vendor only" });
    });
  });
};

module.exports = staffOrVendor;