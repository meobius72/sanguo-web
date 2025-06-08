const express = require('express');
const router = express.Router();
const City = require('../models/City');
const General = require('../models/General');

// GET /api/cities - 도시 전체 목록 조회
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 도시 점령(공격): POST /api/cities/:id/attack
router.post('/:id/attack', async (req, res) => {
  const defenderCityId = req.params.id;
  const { attackerCityId } = req.body;
  const City = require('../models/City');

  try {
    const attacker = await City.findById(attackerCityId);
    const defender = await City.findById(defenderCityId);
    if (!attacker || !defender) {
      return res.status(404).json({ error: '도시를 찾을 수 없습니다.' });
    }

    // 장수 스킬 효과 적용
    const attackerGenerals = await General.find({ _id: { $in: attacker.generals } });
    const defenderGenerals = await General.find({ _id: { $in: defender.generals } });
    const braveCount = attackerGenerals.filter(g => g.skills && g.skills.includes('용맹')).length;
    const wiseCount = defenderGenerals.filter(g => g.skills && g.skills.includes('지략')).length;
    let attackerPower = attacker.soldiers;
    let defenderPower = defender.soldiers + defender.defense;
    if (braveCount > 0) {
      attackerPower = Math.floor(attackerPower * (1 + 0.1 * braveCount));
    }
    if (wiseCount > 0) {
      defenderPower = Math.floor(defenderPower * (1 + 0.1 * wiseCount));
    }

    let result = '';
    if (attackerPower > defenderPower) {
      // 공격 성공: 소유자 변경
      defender.owner = attacker.owner;
      // 병사 소모(간단화)
      attacker.soldiers -= Math.floor(defenderPower * 0.5);
      defender.soldiers = Math.floor(defender.soldiers * 0.3);
      await defender.save();
      await attacker.save();
      result = '공격 성공! 도시를 점령했습니다.';
    } else {
      // 공격 실패: 병사 소모
      attacker.soldiers = Math.floor(attacker.soldiers * 0.5);
      await attacker.save();
      result = '공격 실패! 방어에 성공했습니다.';
    }

    res.json({ result, attacker, defender });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 도시 자원 관리(업데이트): PATCH /api/cities/:id/resources
router.patch('/:id/resources', async (req, res) => {
  const cityId = req.params.id;
  const { gold, food, soldiers, defense } = req.body;
  try {
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ error: '도시를 찾을 수 없습니다.' });
    }
    if (gold !== undefined) city.gold = gold;
    if (food !== undefined) city.food = food;
    if (soldiers !== undefined) city.soldiers = soldiers;
    if (defense !== undefined) city.defense = defense;
    await city.save();
    res.json({ message: '도시 자원 업데이트 성공', city });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 도시 상세 조회: GET /api/cities/:id
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ error: '도시를 찾을 수 없습니다.' });
    }
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 도시 정보 수정(업데이트): PATCH /api/cities/:id
router.patch('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ error: '도시를 찾을 수 없습니다.' });
    }
    Object.keys(req.body).forEach(key => {
      if (key in city) city[key] = req.body[key];
    });
    await city.save();
    res.json({ message: '도시 정보 업데이트 성공', city });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 