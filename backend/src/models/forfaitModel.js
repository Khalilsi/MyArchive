const mongoose = require("mongoose");

const forfaitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Freemium", "Premium", "Corporate"], // Fixed typo: extra space removed from "Freemium"
    },

    // Quantitative limits
    maxDocumentsPerYear: { type: Number, required: true },
    maxDocumentsPerMonth: { type: Number, required: true },

    // Pricing
    unitPrice: { type: Number, required: true }, // Price per document
    annualPrice: { type: Number, required: true },

    // Functionalities
    features: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Forfait = mongoose.model("Forfait", forfaitSchema);
module.exports = Forfait;
