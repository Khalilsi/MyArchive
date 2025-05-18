const mongoose = require("mongoose");

const forfaitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Free", "Premium", "Enterprise"], // Example plans
    },
    maxStorage: {
      type: Number, // Storage in MB (e.g., 100MB for Free)
      required: true,
    },
    description: String, // Optional (e.g., "100MB storage")
  },
  { timestamps: true }
);

const Forfait = mongoose.model("Forfait", forfaitSchema);
module.exports = Forfait;
