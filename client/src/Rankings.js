import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Rankings() {
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await axios.get('/api/game/rankings');
        setRankings(res.data);
      } catch (err) {
        setError('랭킹을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>게임 랭킹</h2>

      {rankings && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {/* 도시 수 랭킹 */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3>도시 수</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th>순위</th><th>유저</th><th>도시 수</th></tr>
              </thead>
              <tbody>
                {rankings.byCity.map((rank, index) => (
                  <tr key={rank.username}>
                    <td>{index + 1}</td>
                    <td>{rank.username}</td>
                    <td>{rank.cityCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 장수 수 랭킹 */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3>장수 수</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th>순위</th><th>유저</th><th>장수 수</th></tr>
              </thead>
              <tbody>
                {rankings.byGeneral.map((rank, index) => (
                  <tr key={rank.username}>
                    <td>{index + 1}</td>
                    <td>{rank.username}</td>
                    <td>{rank.generalCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 금 랭킹 */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3>금</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th>순위</th><th>유저</th><th>금</th></tr>
              </thead>
              <tbody>
                {rankings.byGold.map((rank, index) => (
                  <tr key={rank.username}>
                    <td>{index + 1}</td>
                    <td>{rank.username}</td>
                    <td>{rank.gold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 식량 랭킹 */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3>식량</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th>순위</th><th>유저</th><th>식량</th></tr>
              </thead>
              <tbody>
                {rankings.byFood.map((rank, index) => (
                  <tr key={rank.username}>
                    <td>{index + 1}</td>
                    <td>{rank.username}</td>
                    <td>{rank.food}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 병사 랭킹 */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3>병사</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th>순위</th><th>유저</th><th>병사</th></tr>
              </thead>
              <tbody>
                {rankings.bySoldiers.map((rank, index) => (
                  <tr key={rank.username}>
                    <td>{index + 1}</td>
                    <td>{rank.username}</td>
                    <td>{rank.soldiers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}

export default Rankings; 