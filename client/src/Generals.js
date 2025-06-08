import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Generals() {
  const [generals, setGenerals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenerals = async () => {
      try {
        const res = await axios.get('/api/generals');
        setGenerals(res.data);
      } catch (err) {
        setError('장수 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchGenerals();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>장수 목록</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>이름</th>
            <th>세력</th>
            <th>도시</th>
            <th>무력</th>
            <th>지력</th>
            <th>정치</th>
            <th>매력</th>
            <th>충성도</th>
            <th>상태</th>
            <th>특성</th>
          </tr>
        </thead>
        <tbody>
          {generals.map(g => (
            <tr key={g._id}>
              <td>{g.name}</td>
              <td>{g.force}</td>
              <td>{g.city}</td>
              <td>{g.str}</td>
              <td>{g.int}</td>
              <td>{g.pol}</td>
              <td>{g.cha}</td>
              <td>{g.loyalty}</td>
              <td>{g.status}</td>
              <td>{g.skills?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Generals; 