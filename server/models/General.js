const mongoose = require('mongoose');

const GeneralSchema = new mongoose.Schema({
  name: { type: String, required: true },
  force: { type: String, required: true }, // 소속 세력/유저명
  city: { type: String, required: true }, // 현재 도시명
  str: { type: Number, required: true }, // 무력
  int: { type: Number, required: true }, // 지력
  pol: { type: Number, required: true }, // 정치
  cha: { type: Number, required: true }, // 매력
  loyalty: { type: Number, default: 100 }, // 충성도
  status: { type: String, default: '재직' }, // 상태(재직, 포로 등)
  skills: [{ type: String }] // 특성/스킬
});
npm
module.exports = mongoose.model('General', GeneralSchema); 