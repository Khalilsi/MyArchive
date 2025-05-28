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
  const { name, maxStorage, price } = req.body;
  try {
    const forfait = await Forfait.findById(req.params.id);
    if (!forfait) return res.status(404).json({ success: false, message: 'Not found' });

    if (name !== undefined) forfait.name = name;
    if (maxStorage !== undefined) forfait.maxStorage = maxStorage;
    if (price !== undefined) forfait.price = price;

    await forfait.save();
    res.status(200).json({ success: true, message: 'Updated', data: forfait });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
