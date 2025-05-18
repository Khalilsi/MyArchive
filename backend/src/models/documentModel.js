const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      required: true,
    },
    displayType: {
      type: String,
      enum: ['PDF', 'JPG', 'PNG', 'DOCX'],
      required: true,
    },
    size: {
      type: Number, // Size in MB
      required: true,
    },
    category: String, // Optional (e.g., "Contracts")
    filePath: {
      type: String, // URL or local path (after upload)
      required: true,
    },
    archive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Archive',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }, { timestamps: true });
  
  const Document = mongoose.model('Document', documentSchema);
  module.exports = Document; 