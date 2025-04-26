const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ["secteursActivite", "typesArchives"]  // Only allow these config types
  },
  options: { 
    type: [String], 
    required: true 
  } // Stores dropdown values (e.g., ["Santé", "Éducation", ...])
});

const Config = mongoose.model('Config', configSchema);
module.exports = Config;