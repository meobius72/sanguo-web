const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// DB 연결
connectDB();

// 라우터 등록
app.use('/api/generals', require('./routes/general'));
app.use('/api/cities', require('./routes/city'));
app.use('/api/users', require('./routes/user'));
app.use('/api/game', require('./routes/game'));
app.use('/api/logs', require('./routes/log'));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Sanguo Web Game API');
});

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중...`);
}); 