// src/components/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./Login.css";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 아이디 → 이메일 형태로 변환
      const email = `${id}@myapp.com`;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      onLogin(userCredential.user);
    } catch (error) {
      alert("로그인 실패 😢 : " + error.message);
    } finally {
      setLoading(false);
    }
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
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="login-switch">
        계정이 없나요?{" "}
        <button onClick={onSwitchToRegister}>회원가입</button>
      </p>
    </div>
  );
}
