import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";

// 컴포넌트 import
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Header from "./components/Header.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";

import "./App.css"; // 전체 스타일 (선택사항)

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login | register
  const [feedback, setFeedback] = useState("");

  // 🔹 로그아웃 기능
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setPage("login");
    setFeedback("");
  };

  // 🔹 ThinkingForm → AI 피드백 결과 받기
  const handleFeedback = (aiFeedback) => {
    setFeedback(aiFeedback);
  };

  return (
    <div className="app-container">
      {!user ? (
        // 로그인 / 회원가입 구분
        page === "login" ? (
          <Login
            onLogin={setUser}
            onSwitchToRegister={() => setPage("register")}
          />
        ) : (
          <Register
            onRegister={setUser}
            onSwitchToLogin={() => setPage("login")}
          />
        )
      ) : (
        <>
          {/* --- 상단 헤더 컴포넌트 --- */}
          <Header onLogout={handleLogout} />

          {/* --- 사고력 폼 --- */}
          <ThinkingForm user={user} onFeedback={handleFeedback} />

          {/* --- AI 피드백 표시 --- */}
          <FeedbackDisplay feedback={feedback} />
        </>
      )}
    </div>
  );
}
