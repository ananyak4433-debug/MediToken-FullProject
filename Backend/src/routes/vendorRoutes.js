const express = require('express');
const router = express.Router();

const {
    createVendor,
    vendorLogin,
    vendorLogout,
    getVendorProfile,
    getVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    getPublicVendors
} = require('../controllers/vendorController');

const vendorProtect = require('../middleware/vendorAuthMiddleware');
const adminProtect = require('../middleware/adminAuthMiddleware')


// 🔐 AUTH
router.post('/vendors/signup',adminProtect, createVendor);
router.post('/vendors/login', vendorLogin);
router.post('/vendors/logout', vendorLogout);

// 👤 PROFILE
router.get('/vendors/profile', vendorProtect, getVendorProfile);

// 📦 CRUD
router.get('/vendors/allVendors', adminProtect, getVendors);
router.get('/vendors/public', getPublicVendors);
router.get('/vendors/:id', adminProtect, getVendorById);
router.put('/vendors/:id', vendorProtect, updateVendor);
router.delete('/vendors/:id', vendorProtect, deleteVendor);

module.exports = router;