import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ThinkingForm from "./components/ThinkingForm.jsx";
import FeedbackDisplay from "./components/FeedbackDisplay.jsx";
import MindMap from "./components/MindMap.jsx"; // 🧠 추가: 사고 과정 마인드맵
import Header from "./components/Header.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MyRecords from "./pages/MyRecords.jsx";
import { adminIds } from "./config/adminConfig.js";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login | register | form | records
  const [feedback, setFeedback] = useState(null); // ✅ AI JSON 전체
  const [theme, setTheme] = useState("light");
  const [formData, setFormData] = useState(null); // ✅ 마인드맵용

  // ✅ 로그인 유지
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
    setFeedback(null);
    setFormData(null);
    localStorage.removeItem("user");
  };

  // ✅ 다크모드 토글
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // ✅ 기록 작성 완료 시 “나의 기록”으로 자동 이동
  const handleFormComplete = (aiResult, form) => {
    setFeedback(aiResult); // ✅ AI JSON 구조 통째로 저장
    setFormData(form); // ✅ 마인드맵 표시용
    setPage("records");
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

          {/* ✅ 관리자 */}
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
                  <ThinkingForm
                    user={user}
                    onFeedback={(aiResult, form) => handleFormComplete(aiResult, form)}
                  />
                  {formData && <MindMap form={formData} />} {/* 사고 과정 시각화 */}
                  {feedback && <FeedbackDisplay feedback={feedback} />} {/* AI JSON 피드백 표시 */}
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
