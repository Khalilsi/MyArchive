const mongoose = require('mongoose');

const connectionHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Keep only last 10 connections per user
connectionHistorySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('ConnectionHistory', connectionHistorySchema);