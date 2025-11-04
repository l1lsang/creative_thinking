// src/components/Header.jsx
import "./Header.css";

export default function Header({ title = "🧠 사고력 향상 프로젝트", onLogout }) {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      {onLogout && (
        <button className="header-btn" onClick={onLogout}>
          로그아웃
        </button>
      )}
    </header>
  );
}
