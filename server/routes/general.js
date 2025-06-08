const express = require('express');
const router = express.Router();
const General = require('../models/General');
const City = require('../models/City');
const Log = require('../models/Log');

// GET /api/generals - 장수 전체 목록 조회
router.get('/', async (req, res) => {
  try {
    const generals = await General.find();
    res.json(generals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 장수 이동: POST /api/generals/:id/transfer
router.post('/:id/transfer', async (req, res) => {
  const generalId = req.params.id;
  const { cityName } = req.body;

  try {
    // 이동할 도시 찾기
    const targetCity = await City.findOne({ name: cityName });
    if (!targetCity) {
      return res.status(404).json({ error: '도시를 찾을 수 없습니다.' });
    }

    // 장수 정보 가져오기
    const general = await General.findById(generalId);
    if (!general) {
      return res.status(404).json({ error: '장수를 찾을 수 없습니다.' });
    }

    // 기존 도시에서 generals 목록에서 제거
    await City.updateOne(
      { name: general.city },
      { $pull: { generals: general._id } }
    );

    // 새 도시의 generals 목록에 추가
    targetCity.generals.push(general._id);
    await targetCity.save();

    // 장수의 city 필드 업데이트
    general.city = cityName;
    await general.save();

    res.json({ message: '장수 이동 완료', general });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 장수 영입: POST /api/generals/:id/recruit
router.post('/:id/recruit', async (req, res) => {
  const generalId = req.params.id;
  const { force } = req.body; // 영입할 유저명 또는 세력명

  try {
    const general = await General.findById(generalId);
    if (!general) {
      return res.status(404).json({ error: '장수를 찾을 수 없습니다.' });
    }

    // 이미 소속이 있거나(재직), 충성도가 높으면 영입 불가
    if (general.status === '재직' && general.force === force) {
      return res.status(400).json({ error: '이미 해당 세력에 소속된 장수입니다.' });
    }
    if (general.loyalty > 50 && general.status === '재직') {
      return res.status(400).json({ error: '충성도가 높아 영입할 수 없습니다.' });
    }

    // 영입 성공
    general.force = force;
    general.status = '재직';
    general.loyalty = 100;
    await general.save();

    // 영입 로그 기록
    await Log.create({ type: 'recruit', message: `${force}(이)가 ${general.name}(을)를 영입했습니다.` });

    res.json({ message: '장수 영입 성공', general });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 장수 상세 조회: GET /api/generals/:id
router.get('/:id', async (req, res) => {
  try {
    const general = await General.findById(req.params.id);
    if (!general) {
      return res.status(404).json({ error: '장수를 찾을 수 없습니다.' });
    }
    res.json(general);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 장수 정보 수정(업데이트): PATCH /api/generals/:id
router.patch('/:id', async (req, res) => {
  try {
    const general = await General.findById(req.params.id);
    if (!general) {
      return res.status(404).json({ error: '장수를 찾을 수 없습니다.' });
    }
    Object.keys(req.body).forEach(key => {
      if (key in general) general[key] = req.body[key];
    });
    await general.save();
    res.json({ message: '장수 정보 업데이트 성공', general });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 