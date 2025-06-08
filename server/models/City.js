const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true }, // 소유자(유저/AI)
  gold: { type: Number, default: 1000 },
  food: { type: Number, default: 1000 },
  soldiers: { type: Number, default: 1000 },
  defense: { type: Number, default: 100 },
  generals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'General' }]
});

module.exports = mongoose.model('City', CitySchema)