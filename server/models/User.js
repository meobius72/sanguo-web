const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }],
  generals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'General' }]
});

module.exports = mongoose.model('User', UserSchema); 