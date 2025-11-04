// src/components/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./Register.css";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 아이디 → 이메일 변환
      const email = `${id}@myapp.com`;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      onRegister(userCredential.user);
    } catch (error) {
      alert("회원가입 실패 😢 : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">회원가입 ✨</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          required
        />
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="register-switch">
        이미 계정이 있나요?{" "}
        <button onClick={onSwitchToLogin}>로그인</button>
      </p>
    </div>
  );
}
