// src/components/Login.jsx
import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 예시: 비밀번호 검증은 일단 생략 가능 (나중에 Firestore로 연결 가능)
    if (!id.trim()) {
      alert("아이디를 입력해주세요!");
      return;
    }

    // 로그인 성공 시 App.jsx로 user 객체 전달
    onLogin({ id }); 
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인 🔑</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>

      <p className="login-switch">
        계정이 없나요?{" "}
        <button onClick={onSwitchToRegister}>회원가입</button>
      </p>
    </div>
  );
}
