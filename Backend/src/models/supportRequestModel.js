const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentBy:  { type: String, enum: ["admin", "vendor"], required: true },
  sentAt:  { type: Date, default: Date.now }
});


const capitalize = (val) =>
  val && typeof val === 'string'
    ? val.charAt(0).toUpperCase() + val.slice(1)
    : val;


const supportRequestSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true },
    supportType: { type: String, required: true, trim: true },
    subject:     { type: String, required: true, trim: true ,set: capitalize},
    message:     { type: String, required: true, trim: true ,set: capitalize},
    status: {
      type: String,
      enum: ["Open", "Pending", "Closed"],
      default: "Open"
    },
    replies: [replySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);