const mongoose = require('mongoose');
const General = require('../server/models/General');
const City = require('../server/models/City');
const User = require('../server/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sanguo';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // 기존 데이터 삭제
  await General.deleteMany({});
  await City.deleteMany({});
  await User.deleteMany({});

  // 유저 생성
  const user = new User({
    username: '유비',
    password: 'test1234', // 실제 서비스에서는 해시 필요
    cities: [],
    generals: []
  });
  await user.save();

  // 도시 생성
  const city = new City({
    name: '성도',
    owner: user.username,
    gold: 2000,
    food: 3000,
    soldiers: 1500,
    defense: 120,
    generals: []
  });
  await city.save();

  // 장수 생성
  const general = new General({
    name: '관우',
    force: user.username,
    city: city.name,
    str: 98,
    int: 75,
    pol: 70,
    cha: 90,
    loyalty: 100,
    status: '재직'
  });
  await general.save();

  // 관계 연결
  user.cities.push(city._id);
  user.generals.push(general._id);
  city.generals.push(general._id);
  await user.save();
  await city.save();

  console.log('시드 데이터 삽입 완료!');
  mongoose.disconnect();
}

seed(); 