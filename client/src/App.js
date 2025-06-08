import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Cities from './Cities';
import Generals from './Generals';
import Logs from './Logs';
import Rankings from './Rankings';
import GameActions from './GameActions';

function Home() {
  return (
    <div>
      <h2>삼국지2 웹 게임에 오신 것을 환영합니다!</h2>
      <GameActions />
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ margin: 10 }}>홈</Link>
        <Link to="/login" style={{ margin: 10 }}>로그인</Link>
        <Link to="/register" style={{ margin: 10 }}>회원가입</Link>
        <Link to="/cities" style={{ margin: 10 }}>도시</Link>
        <Link to="/generals" style={{ margin: 10 }}>장수</Link>
        <Link to="/logs" style={{ margin: 10 }}>로그</Link>
        <Link to="/rankings" style={{ margin: 10 }}>랭킹</Link>
      </nav>
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/generals" element={<Generals />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/rankings" element={<Rankings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
