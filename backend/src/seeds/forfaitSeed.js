const mongoose = require("mongoose");
const Forfait = require("../models/forfaitModel");

const forfaits = [
  {
    name: "Free",
    maxStorage: 100, // 100MB
    description: "Basic storage plan with 100MB",
  },
  {
    name: "Premium",
    maxStorage: 1024, // 1GB
    description: "Premium storage plan with 1GB",
  },
  {
    name: "Enterprise",
    maxStorage: 5120, // 5GB
    description: "Enterprise storage plan with 5GB",
  },
];

const seedForfaits = async () => {
  try {
    // Clear existing forfaits
    await Forfait.deleteMany({});

    // Insert new forfaits
    await Forfait.insertMany(forfaits);

    console.log("Forfaits seeded successfully");
  } catch (error) {
    console.error("Error seeding forfaits:", error);
  }
};

module.exports = seedForfaits;
