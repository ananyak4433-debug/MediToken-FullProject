
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
{
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
    },

    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    },

    patientName:   { type: String },
    patientAge:    { type: String },
    patientGender: { type: String },

    appointmentDay:  { type: String },   // optional (UI use)
    appointmentTime: { type: String },   // optional (UI use)

    // ❗ OLD (keep only for display/backward compatibility)
    appointmentDate: { type: Date },

    // ✅ ✅ MAIN FIELD (CRITICAL FIX)
    appointmentDateTime: {
        type: Date,
        required: true,
        index: true   // 🔥 improves query performance
    },

    notes:  { type: String },

    tokenNumber: {
        type: Number,
        required: true,
        index: true
    },

    status: {
        type: String,
        enum: ['available', 'booked', 'serving', 'cancelled', 'completed'],
        required: true,
        index: true
    },

    canceledAt: { type: Date },

    bookedAt: {
        type: Date,
        default: Date.now
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);