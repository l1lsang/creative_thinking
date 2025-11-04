import { useState } from "react";
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
  const [page, setPage] = useState("login");
  const [feedback, setFeedback] = useState("");
  const [theme, setTheme] = useState("light");

  // ✅ 로그아웃
  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setFeedback("");
  };

  // ✅ 다크모드 토글
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // ✅ AI 피드백 업데이트
  const handleFeedback = (aiFeedback) => {
    setFeedback(aiFeedback);
  };

  // ✅ 관리자 여부 확인
  const isAdmin = user && adminIds.includes(user.id);

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
          <Header
            onLogout={handleLogout}
            onToggleTheme={toggleTheme}
            theme={theme}
          />
          <AdminDashboard />
        </>
      ) : (
        <>
          <Header
            onLogout={handleLogout}
            onToggleTheme={toggleTheme}
            theme={theme}
          />
          <ThinkingForm user={user} onFeedback={handleFeedback} />
          <FeedbackDisplay feedback={feedback} />
        </>
      )}
    </div>
  );
}
