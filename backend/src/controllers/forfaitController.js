const Forfait = require('../models/forfaitModel');

// GET all forfaits
exports.getAllForfaits = async (req, res) => {
  try {
    const forfaits = await Forfait.find();
    res.status(200).json({ success: true, data: forfaits });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET a single forfait by ID
exports.getForfaitById = async (req, res) => {
  try {
    const forfait = await Forfait.findById(req.params.id);
    if (!forfait) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: forfait });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE forfait
exports.updateForfait = async (req, res) => {
  try {
    const forfait = await Forfait.findById(req.params.id);
    if (!forfait) return res.status(404).json({ success: false, message: 'Forfait not found' });

    // Top-level fields
    const {
      name,
      maxDocumentsPerYear,
      maxDocumentsPerMonth,
      unitPrice,
      annualPrice,
      features,
    } = req.body;

    if (name !== undefined) forfait.name = name;
    if (maxDocumentsPerYear !== undefined) forfait.maxDocumentsPerYear = maxDocumentsPerYear;
    if (maxDocumentsPerMonth !== undefined) forfait.maxDocumentsPerMonth = maxDocumentsPerMonth;
    if (unitPrice !== undefined) forfait.unitPrice = unitPrice;
    if (annualPrice !== undefined) forfait.annualPrice = annualPrice;

    // Update features if present
    if (features && typeof features === 'object') {
      for (const [key, value] of Object.entries(features)) {
        forfait.features[key] = value; // Will update or add new feature field dynamically
      }
    }

    await forfait.save();
    res.status(200).json({ success: true, message: 'Forfait updated successfully', data: forfait });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
