const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Restrict to these values
      default: "user", // New users are regular users by default
    },
    isApproved: {
      type: Boolean,
      default: false, // Users start unapproved until admin approves
    },
    forfait: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Forfait",
      required: true,
      default: "65d1a8b0e4b1f1f4c8e3d3a1", // Default: Free plan (set a real Forfait _id)
    },
    usedStorage: {
      type: Number,
      default: 0, // Starts at 0MB
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
