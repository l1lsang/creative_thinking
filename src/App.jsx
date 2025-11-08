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
  const [page, setPage] = useState("login"); // login | register | form | feedback | mindmap | records
  const [feedback, setFeedback] = useState(null); // ✅ AI JSON 전체
  const [formData, setFormData] = useState(null); // ✅ 사고 기록 데이터
  const [theme, setTheme] = useState("light");

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

  // ✅ 폼 작성 완료 시 AI 피드백 저장 + 다음 페이지 이동
  const handleFormComplete = (aiResult, form) => {
    setFeedback(aiResult); // AI JSON 저장
    setFormData(form); // 사고 데이터 저장
    setPage("feedback"); // ✅ 자동으로 피드백 단계로 이동
  };

  // ✅ 관리자 여부
  const isAdmin = user && adminIds.includes(user.id);

  return (
    <div className={`app-container ${theme}`}>
      {/* 로그인 X 상태 */}
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

              {/* ✅ 페이지 전환 */}
              {page === "form" && (
                <ThinkingForm
                  user={user}
                  onFeedback={(aiResult, form) => handleFormComplete(aiResult, form)}
                />
              )}

              {page === "feedback" && feedback && (
                <div className="feedback-stage">
                  <FeedbackDisplay feedback={feedback} />
                  <div className="nav-center">
                    <button
                      className="next-btn"
                      onClick={() => setPage("mindmap")}
                    >
                      🧭 사고 흐름 시각화 보기
                    </button>
                  </div>
                </div>
              )}

              {page === "mindmap" && feedback && (
                <div className="mindmap-stage">
                  <MindMap aiFeedback={feedback} />
                  <div className="nav-center">
                    <button
                      className="next-btn"
                      onClick={() => setPage("records")}
                    >
                      📚 나의 기록으로 이동
                    </button>
                  </div>
                </div>
              )}

              {page === "records" && <MyRecords user={user} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
