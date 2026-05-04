const Vendor = require('../models/vendorModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔐 Generate Token + Set Cookie
const sendTokenResponse = (res, vendor, statusCode = 200) => {
    const token = jwt.sign(
        { id: vendor._id, role: "vendor" }, // ✅ MUST include role
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
    );
    res.cookie('vendorToken', token, {
        httpOnly: true,
        secure: false,          // true in production (HTTPS)
        sameSite: 'lax',        // 'none' if frontend on different domain
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(statusCode).json({
        success: true,
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email
    });
};


exports.createVendor = async (req, res) => {
    try {
        const { name, email, password, ...rest } = req.body;

        // check existing
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor already exists' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const vendor = await Vendor.create({
            name,
            email,
            password: hashedPassword,
            ...rest
        });

        // send token in cookie
        sendTokenResponse(res, vendor, 201);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        sendTokenResponse(res, vendor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getVendorProfile = async (req, res) => {
    try {
        // console.log("REQ.VENDOR:", req.vendor);  
        res.status(200).json(req.vendor);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};



exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().select('-password');
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch vendors' });
    }
};



exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).select('-password');

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch vendor' });
    }
};



exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json({ message: 'Vendor deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Failed to delete vendor' });
    }
};


exports.getPublicVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: 'active' })
      .select('organisationName address phone registrationNumber createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.vendorLogout = async (req, res) => {
    res.cookie('vendorToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Logged out successfully' });
};