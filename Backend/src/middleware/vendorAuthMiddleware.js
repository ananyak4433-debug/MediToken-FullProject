

const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendorModel");

const vendorProtect = async (req, res, next) => {
  try {
     console.log('🍪 Cookies received:', req.cookies);
    console.log('🔑 Auth header:', req.headers.authorization);
    const token =
      req.cookies?.vendorToken ||
      req.headers.authorization?.split(" ")[1];

       console.log('🎫 Token found:', token ? 'YES' : 'NO'); 

    if (!token) {
      return next(new Error("Not authorized, token missing")); // ✅ no res.json
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "vendor") {
      return next(new Error("Access denied: not a vendor")); // ✅ no res.json
    }

    const vendor = await Vendor.findById(decoded.id).select("-password");

    if (!vendor) {
      return next(new Error("Vendor not found")); // ✅ no res.json
    }

    req.vendor = vendor;
    req.role = "vendor";
    next(); // ✅ success — no error passed

  } catch (error) {
    return next(error); // ✅ no res.json
  }
};

module.exports = vendorProtect;