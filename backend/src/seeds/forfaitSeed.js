const mongoose = require("mongoose");
const Forfait = require("../models/forfaitModel");

const forfaits = [
  {
    name: "Freemium ",
    maxStorage: 100, // 100MB
    price : 150, 
  },
  {
    name: "Premium",
    maxStorage: 1024, // 1GB
    price: 250, 
  },
  {
    name: "Corporate",
    maxStorage: 5120, // 5GB
    price: 500, 
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
