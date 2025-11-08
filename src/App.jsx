import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";
import MindMap from "./components/MindMap.jsx";
import Header from "./components/Header.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MyRecords from "./pages/MyRecords.jsx";
import { adminIds } from "./config/adminConfig.js";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [feedback, setFeedback] = useState(null);
  const [theme, setTheme] = useState("light");

  // 로그인 유지
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage("form");
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    setFeedback(null);
    setPage("login");
    localStorage.removeItem("user");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleFormComplete = (aiResult) => {
    setFeedback(aiResult);
    setPage("records"); // 저장 후 자동 이동
  };

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
      ) : (
        <>
          <Header
            onLogout={handleLogout}
            onToggleTheme={toggleTheme}
            theme={theme}
          />

          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <>
              <nav className="student-nav">
                <button
                  className={page === "form" ? "active" : ""}
                  onClick={() => setPage("form")}
                >
                  ✍️ 사고기록
                </button>
                <button
                  className={page === "records" ? "active" : ""}
                  onClick={() => setPage("records")}
                >
                  📘 나의 기록
                </button>
              </nav>

              {page === "form" ? (
                <>
                  <ThinkingForm user={user} onFeedback={handleFormComplete} />
                  {feedback && (
                    <>
                      <FeedbackDisplay feedback={feedback} />
                      <MindMap aiFeedback={feedback} />
                    </>
                  )}
                </>
              ) : (
                <MyRecords user={user} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
