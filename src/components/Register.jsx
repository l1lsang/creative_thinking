import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import "./Register.css";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 회원가입 함수
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!id.trim() || !password.trim() || !email.trim()) {
      alert("모든 필드를 입력해주세요!");
      return;
    }
    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다 ❌");
      return;
    }

    setLoading(true);

    try {
      // 🔍 이미 존재하는 아이디 중복 확인
      const q = query(collection(db, "loginInfo"), where("id", "==", id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("이미 존재하는 아이디입니다 ⚠️");
        setLoading(false);
        return;
      }

      // ✅ Firestore에 계정 정보 저장
      await addDoc(collection(db, "loginInfo"), {
        id,
        email,
        password,
        role: "student", // 기본값 (관리자는 수동으로 지정)
        createdAt: new Date(),
      });

      alert("회원가입이 완료되었습니다 🎉");
      onRegister({ id, email, role: "student" });
      localStorage.setItem(
        "user",
        JSON.stringify({ id, email, role: "student" })
      );
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다 ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">회원가입 🪪</h2>

      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="register-input"
          required
        />

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "등록 중..." : "회원가입"}
        </button>
      </form>

      <p className="register-switch">
        이미 계정이 있나요?{" "}
        <button onClick={onSwitchToLogin}>로그인</button>
      </p>
    </div>
  );
}
