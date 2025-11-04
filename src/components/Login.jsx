// src/components/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./Login.css";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [text, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (error) {
      alert("로그인 실패 😢 : " + error.message);
    }
  };

  return (
    <div className="p-6 border rounded max-w-sm mx-auto mt-10 bg-white shadow">
      <h2 className="text-xl font-bold text-center mb-4">로그인 🔑</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="ID 입력"
          value={text}
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
        <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          로그인
        </button>
      </form>

      <p className="text-center mt-3 text-sm">
        계정이 없나요?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-green-600 underline"
        >
          회원가입
        </button>
      </p>
    </div>
  );
}
