import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Header from "./components/Header.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [feedback, setFeedback] = useState("");
  const [theme, setTheme] = useState("light"); // 🌗 라이트모드 기본

  // 🔹 테마 로드 (새로고침 후에도 유지)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // 🔹 테마 토글 함수
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setPage("login");
    setFeedback("");
  };

  const handleFeedback = (aiFeedback) => {
    setFeedback(aiFeedback);
  };

  return (
    <div className={`app-container ${theme}`}>
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
          <Header onLogout={handleLogout} onToggleTheme={toggleTheme} theme={theme} />

          {/* --- 사고력 폼 --- */}
          <ThinkingForm user={user} onFeedback={handleFeedback} />

          {/* --- 피드백 --- */}
          <FeedbackDisplay feedback={feedback} />
        </>
      )}
    </div>
  );
}
