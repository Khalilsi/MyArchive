const mongoose = require("mongoose");

const forfaitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Freemium ", "Premium", "Corporate"], // Example plans
    },
    maxStorage: {
      type: Number, // Storage in MB (e.g., 100MB for Free)
      required: true,
    },
    price: { type: Number, required: true }, 
  },
  { timestamps: true }
);

const Forfait = mongoose.model("Forfait", forfaitSchema);
module.exports = Forfait;
