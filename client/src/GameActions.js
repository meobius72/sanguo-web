import React, { useState } from 'react';
import axios from 'axios';

function GameActions() {
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    setMessage('');
    if (window.confirm('정말로 모든 게임 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        const res = await axios.post('/api/game/reset');
        setMessage(res.data.message + ' (새 데이터를 생성하려면 아래 Seed Data 버튼을 눌러주세요.)');
      } catch (err) {
        setMessage(err.response?.data?.error || '데이터 초기화 실패');
      }
    }
  };

  const handleSeed = async () => {
    setMessage('');
    try {
      const res = await axios.post('/api/game/seed');
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || '샘플 데이터 생성 실패');
    }
  };

  const handleEndTurn = async () => {
    setMessage('');
    try {
      const res = await axios.post('/api/game/endturn');
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || '턴 진행 실패');
    }
  };

  return (
    <div style={{ marginTop: 20, padding: 20, border: '1px solid #eee', borderRadius: 5 }}>
      <h3>게임 관리</h3>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleReset} style={{ marginRight: 10, padding: '10px 15px' }}>데이터 초기화</button>
        <button onClick={handleSeed} style={{ padding: '10px 15px' }}>샘플 데이터 생성</button>
      </div>
      <div>
        <button onClick={handleEndTurn} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>턴 진행</button>
      </div>
      {message && <div style={{ marginTop: 10, color: 'blue' }}>{message}</div>}
    </div>
  );
}

export default GameActions; 