import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";
import "./App.css"; // 전체 레이아웃용 공통 스타일 (선택사항)

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login | register
  const [feedback, setFeedback] = useState("");

  // 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setPage("login");
    setFeedback("");
  };

  // ThinkingForm에서 받아온 피드백을 화면에 표시
  const handleFeedback = (aiFeedback) => {
    setFeedback(aiFeedback);
  };

  return (
    <div className="app-container">
      {!user ? (
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
          {/* --- 상단 헤더 --- */}
          <header className="app-header">
            <h1 className="app-title">🧠 사고력 향상 프로젝트</h1>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </header>

          {/* --- 사고력 폼 --- */}
          <ThinkingForm user={user} onFeedback={handleFeedback} />

          {/* --- AI 피드백 --- */}
          <FeedbackDisplay feedback={feedback} />
        </>
      )}
    </div>
  );
}
