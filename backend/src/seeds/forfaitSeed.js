const mongoose = require("mongoose");
const Forfait = require("../models/forfaitModel");

const forfaits = [
  {
    name: "Freemium",
    maxDocumentsPerYear: 300000,
    maxDocumentsPerMonth: 25000,
    unitPrice: 0.150,
    annualPrice: 45000,
    features: {
      gedDashboard: "basic",
      classementAuto: "basic",
      ocrSearch: "basic",
      cloudStorage: "shared",
      activityLog: "basic",
      batchDownload: false,
      autoBackup: false,
      apiIntegration: "none",
      dataSecurity: "basic"
    }
  },
  {
    name: "Premium",
    maxDocumentsPerYear: 300000,
    maxDocumentsPerMonth: 25000,
    unitPrice: 0.250,
    annualPrice: 75000,
    features: {
      gedDashboard: "advanced",
      classementAuto: "advanced",
      ocrSearch: "advanced",
      cloudStorage: "encrypted",
      activityLog: "detailed",
      batchDownload: true,
      autoBackup: true,
      apiIntegration: "standard",
      dataSecurity: "legal"
    }
  },
  {
    name: "Corporate",
    maxDocumentsPerYear: 150000,
    maxDocumentsPerMonth: 12500,
    unitPrice: 0.500,
    annualPrice: 75000,
    features: {
      gedDashboard: "custom",
      classementAuto: "custom",
      ocrSearch: "multilingual+AI",
      cloudStorage: "dedicated",
      activityLog: "detailed+alerts",
      batchDownload: true,
      autoBackup: true,
      apiIntegration: "full+support",
      dataSecurity: "full+SLA+GDPR"
    }
  }
];

const seedForfaits = async () => {
  try {
    for (const data of forfaits) {
      await Forfait.findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Forfaits seeded/updated successfully");
  } catch (error) {
    console.error("❌ Error seeding forfaits:", error);
  }
};

module.exports = seedForfaits;
