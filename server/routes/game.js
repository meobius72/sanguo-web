const express = require('express');
const router = express.Router();
const City = require('../models/City');
const User = require('../models/User');
const General = require('../models/General');
const Log = require('../models/Log');

const attackCity = async (attacker, defender) => {
  // 간단한 전투 로직: 병사 수 + 방어력 비교
  const attackerPower = attacker.soldiers;
  const defenderPower = defender.soldiers + defender.defense;
  if (attackerPower > defenderPower) {
    defender.owner = attacker.owner;
    attacker.soldiers -= Math.floor(defenderPower * 0.5);
    defender.soldiers = Math.floor(defender.soldiers * 0.3);
    await defender.save();
    await attacker.save();
    return '공격 성공! 도시를 점령했습니다.';
  } else {
    attacker.soldiers = Math.floor(attacker.soldiers * 0.5);
    await attacker.save();
    return '공격 실패! 방어에 성공했습니다.';
  }
};

// 턴 진행: POST /api/game/endturn
router.post('/endturn', async (req, res) => {
  try {
    // 모든 도시의 자원 증가
    const cities = await City.find();
    const generals = await General.find();
    for (const city of cities) {
      // 도시 소속 장수 특성 보너스 계산
      const cityGenerals = generals.filter(g => city.generals.includes(g._id));
      const adminCount = cityGenerals.filter(g => g.skills && g.skills.includes('내정')).length;
      const cavalryCount = cityGenerals.filter(g => g.skills && g.skills.includes('기마술')).length;
      city.gold += 100 + adminCount * 30;
      city.food += 100 + adminCount * 30;
      city.soldiers += 50 + cavalryCount * 20;
      // AI 세력 추가 행동
      if (city.owner === 'AI') {
        city.soldiers += 50; // AI는 병사 추가 증가
        // 30% 확률로 공격 시도
        if (Math.random() < 0.3) {
          // 공격 대상: 자신이 아닌 랜덤 도시
          const targets = cities.filter(c => c._id.toString() !== city._id.toString());
          if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            await attackCity(city, target);
          }
        }
      }
      // 20% 확률로 무작위 이벤트 발생
      if (Math.random() < 0.2) {
        const eventType = Math.floor(Math.random() * 5);
        let eventMsg = '';
        switch (eventType) {
          case 0:
            city.gold += 200;
            eventMsg = `${city.name}에서 금을 추가로 획득했습니다!`;
            break;
          case 1:
            city.food = Math.max(0, city.food - 150);
            eventMsg = `${city.name}에 흉년이 들어 식량이 감소했습니다.`;
            break;
          case 2:
            city.soldiers += 100;
            eventMsg = `${city.name}에서 병사가 대거 모집되었습니다!`;
            break;
          case 3:
            city.defense = Math.max(0, city.defense - 30);
            eventMsg = `${city.name}의 방어력이 약화되었습니다.`;
            break;
          case 4:
            // 도시 소속 장수 중 한 명의 충성도 변화
            const cityGenerals = generals.filter(g => city.generals.includes(g._id));
            if (cityGenerals.length > 0) {
              const targetGeneral = cityGenerals[Math.floor(Math.random() * cityGenerals.length)];
              const delta = Math.random() < 0.5 ? -20 : 20;
              targetGeneral.loyalty = Math.max(0, Math.min(100, targetGeneral.loyalty + delta));
              await targetGeneral.save();
              eventMsg = `${city.name}의 장수 ${targetGeneral.name}의 충성도가 ${delta > 0 ? '상승' : '하락'}했습니다.`;
            }
            break;
        }
        if (eventMsg) {
          await Log.create({ type: 'event', message: eventMsg });
        }
      }
      await city.save();
    }
    // 턴 로그 기록
    await Log.create({ type: 'turn', message: '턴이 진행되었습니다.' });
    const updatedCities = await City.find();
    res.json({ message: '턴 진행 완료', cities: updatedCities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 게임 데이터 초기화(리셋): POST /api/game/reset
router.post('/reset', async (req, res) => {
  try {
    await User.deleteMany({});
    await City.deleteMany({});
    await General.deleteMany({});
    res.json({ message: '게임 데이터가 초기화되었습니다.' });
  } catch (err) {
    console.error('데이터 초기화 중 오류 발생:', err);
    res.status(500).json({ error: err.message });
  }
});

// 샘플 데이터 자동 생성: POST /api/game/seed
router.post('/seed', async (req, res) => {
  try {
    // 1. 유저 생성
    const player1 = new User({ username: 'player1', password: '1234' });
    const ai = new User({ username: 'AI', password: 'ai' });
    await player1.save();
    await ai.save();

    // 2. 장수 생성
    const caoCao = new General({ name: '조조', force: 'player1', city: '낙양', str: 90, int: 95, pol: 90, cha: 85, loyalty: 100, status: '재직', skills: ['지략', '내정'] });
    const luBu = new General({ name: '여포', force: 'AI', city: '장안', str: 99, int: 70, pol: 40, cha: 80, loyalty: 100, status: '재직', skills: ['용맹', '기마술'] });
    await caoCao.save();
    await luBu.save();

    // 3. 도시 생성
    const luoyang = new City({ name: '낙양', owner: 'player1', gold: 1000, food: 1000, soldiers: 1000, defense: 100, generals: [caoCao._id] });
    const changan = new City({ name: '장안', owner: 'AI', gold: 1000, food: 1000, soldiers: 1000, defense: 100, generals: [luBu._id] });
    await luoyang.save();
    await changan.save();

    // 4. 유저에 도시/장수 연결
    player1.cities = [luoyang._id];
    player1.generals = [caoCao._id];
    ai.cities = [changan._id];
    ai.generals = [luBu._id];
    await player1.save();
    await ai.save();

    res.json({ message: '샘플 데이터가 생성되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 게임 통계: GET /api/game/stats
router.get('/stats', async (req, res) => {
  try {
    const users = await User.find();
    const cities = await City.find();
    const generals = await General.find();

    // 전체 수
    const totalUsers = users.length;
    const totalCities = cities.length;
    const totalGenerals = generals.length;

    // 유저별 통계
    const userStats = users.map(user => {
      const userCities = cities.filter(city => city.owner === user.username);
      const userGenerals = generals.filter(g => g.force === user.username);
      return {
        username: user.username,
        cityCount: userCities.length,
        generalCount: userGenerals.length,
        gold: userCities.reduce((sum, c) => sum + (c.gold || 0), 0),
        food: userCities.reduce((sum, c) => sum + (c.food || 0), 0),
        soldiers: userCities.reduce((sum, c) => sum + (c.soldiers || 0), 0)
      };
    });

    res.json({
      totalUsers,
      totalCities,
      totalGenerals,
      userStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 