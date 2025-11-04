import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";
import Header from "./components/Header.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { adminIds } from "./config/adminConfig.js";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // "login" | "register"
  const [feedback, setFeedback] = useState("");
  const [theme, setTheme] = useState("light"); // "light" | "dark"

  // ✅ 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase가 없으면 무시됨:", e.message);
    }
    setUser(null);
    setPage("login");
    setFeedback("");
  };

  // ✅ 다크모드 / 라이트모드 토글
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // ✅ ThinkingForm에서 AI 피드백 받아서 상태 저장
  const handleFeedback = (aiFeedback) => {
    setFeedback(aiFeedback);
  };

  // ✅ 관리자 여부 판별
  const isAdmin = user && adminIds.includes(user.id || user.uid);

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
      ) : isAdmin ? (
        <>
          <Header onLogout={handleLogout} onToggleTheme={toggleTheme} theme={theme} />
          <AdminDashboard />
        </>
      ) : (
        <>
          <Header onLogout={handleLogout} onToggleTheme={toggleTheme} theme={theme} />
          <ThinkingForm user={user} onFeedback={handleFeedback} />
          <FeedbackDisplay feedback={feedback} />
        </>
      )}
    </div>
  );
}
