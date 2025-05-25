const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Initial request fields (required)
  nomEntreprise: {
    type: String,
    required: true
  },
  secteurActivite: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  typeArchives: [{
    type: String,
    required: true
  }],
  forfait: {
    type: String,
    required: true
  },
  
  // Additional fields (optional)
  typeEntreprise: {
    type: String
  },
  numeroIdentificationFiscale: {
    type: String
  },
  siteWeb: {
    type: String
  },
  
  isApproved: {
    type: Boolean,
    default: false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a unique index on numeroIdentificationFiscale that ignores null values
companySchema.index(
  { numeroIdentificationFiscale: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { numeroIdentificationFiscale: { $type: "string" } }
  }
);

module.exports = mongoose.model('Company', companySchema);