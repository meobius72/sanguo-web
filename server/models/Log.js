const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  type: { type: String, required: true }, // ex: 'battle', 'recruit', 'turn', ...
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema); 