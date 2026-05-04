const mongoose = require("mongoose");

const supportTypeSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    description: {
      type: String,
      default: null,
      trim: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportType", supportTypeSchema);