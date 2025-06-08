const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// 게임 로그 전체 조회: GET /api/logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 