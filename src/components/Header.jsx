// src/components/Header.jsx
import "./Header.css";

export default function Header({ onLogout, onToggleTheme, theme }) {
  return (
    <header className="header">
      <h1 className="header-title">🧠 사고력 향상 프로젝트</h1>

      <div className="header-actions">
        <button className="theme-btn" onClick={onToggleTheme}>
          {theme === "light" ? "🌙 다크모드" : "☀️ 라이트모드"}
        </button>
        <button className="header-btn" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
