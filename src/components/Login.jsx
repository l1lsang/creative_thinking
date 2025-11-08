// src/components/Login.jsx
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import "./Login.css";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Firestore 기반 로그인
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요!");
      return;
    }

    setLoading(true);

    try {
      // Firestore에서 id와 password 모두 일치하는 계정 조회
      const q = query(
        collection(db, "loginInfo"),
        where("id", "==", id),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다 ❌");
        setLoading(false);
        return;
      }

      // 로그인 성공 → 유저 데이터 가져오기
      const userData = querySnapshot.docs[0].data();

      // App.jsx로 user 객체 전달
      onLogin(userData);

      // 로컬 스토리지 저장 (자동 로그인 유지용)
      localStorage.setItem("user", JSON.stringify(userData));

      alert(`환영합니다, ${userData.id}님 🌟`);
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다 ❌");
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
