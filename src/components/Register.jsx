// src/components/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Register.css";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다 ❌");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입이 완료되었습니다 🎉");
      onRegister(userCredential.user);
    } catch (error) {
      alert("회원가입 오류: " + error.message);
    }
  };

  return (
    <div className="p-6 border rounded max-w-sm mx-auto mt-10 bg-white shadow">
      <h2 className="text-xl font-bold text-center mb-4">회원가입 🧾</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          회원가입
        </button>
      </form>

      <p className="text-center mt-3 text-sm">
        이미 계정이 있나요?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 underline"
        >
          로그인하기
        </button>
      </p>
    </div>
  );
}
