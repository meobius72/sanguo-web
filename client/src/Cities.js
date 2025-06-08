import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('/api/cities');
        setCities(res.data);
      } catch (err) {
        setError('도시 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>도시 목록</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>이름</th>
            <th>소유자</th>
            <th>금</th>
            <th>식량</th>
            <th>병사</th>
            <th>방어력</th>
            <th>장수 수</th>
          </tr>
        </thead>
        <tbody>
          {cities.map(city => (
            <tr key={city._id}>
              <td>{city.name}</td>
              <td>{city.owner}</td>
              <td>{city.gold}</td>
              <td>{city.food}</td>
              <td>{city.soldiers}</td>
              <td>{city.defense}</td>
              <td>{city.generals?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cities; 