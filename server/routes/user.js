const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - 유저 전체 목록 조회
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 유저 회원가입(생성): POST /api/users
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 중복 체크
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 사용자명입니다.' });
    }
    // 유저 생성
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: '회원가입 성공', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 유저 로그인: POST /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    res.json({ message: '로그인 성공', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 