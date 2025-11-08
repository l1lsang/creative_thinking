import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";
import Header from "./components/Header.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MyRecords from "./pages/MyRecords.jsx";
import { adminIds } from "./config/adminConfig.js";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login | register | form | records
  const [feedback, setFeedback] = useState("");
  const [scores, setScores] = useState(null); // ✅ 새로 추가 (AI 점수)
  const [theme, setTheme] = useState("light");

  // ✅ 로그인 유지 (새로고침 시)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage("form");
    }
  }, []);

  // ✅ 로그아웃
  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setFeedback("");
    setScores(null);
    localStorage.removeItem("user");
  };

  // ✅ 다크모드 토글
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // ✅ 기록 작성 완료 시 “나의 기록”으로 자동 이동 + 점수 저장
  const handleFormComplete = (aiResult) => {
    setFeedback(aiResult.feedback);
    setScores({
      logicScore: aiResult.logicScore,
      criticalScore: aiResult.criticalScore,
      improvementScore: aiResult.improvementScore,
    });
    setPage("records"); // ✅ 자동 이동
  };

  // ✅ 관리자 여부
  const isAdmin = user && adminIds.includes(user.id);

  return (
    <div className={`app-container ${theme}`}>
      {/* 로그인 안 한 상태 */}
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

          {/* ✅ 관리자 페이지 */}
          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <>
              {/* 학생용 네비게이션 */}
              <nav className="student-nav">
                <button
                  className={page === "form" ? "active" : ""}
                  onClick={() => setPage("form")}
                >
                  ✍️ 기록 작성
                </button>
                <button
                  className={page === "records" ? "active" : ""}
                  onClick={() => setPage("records")}
                >
                  📘 나의 기록
                </button>
              </nav>

              {/* ✅ 학생 페이지 분기 */}
              {page === "form" ? (
                <>
                  <ThinkingForm user={user} onFeedback={handleFormComplete} />
                  <FeedbackDisplay feedback={feedback} scores={scores} />
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
