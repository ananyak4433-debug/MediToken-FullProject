
// models/patientModel.js
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const patientSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  age:      { type: Number },
  gender:   { type: String, enum: ['male', 'female', 'other'] }, // ✅ lowercase
  createdAt:{ type: Date, default: Date.now }
})

// ✅ Hash password before saving
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// ✅ matchPassword method used in your loginPatient controller
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('Patient', patientSchema)