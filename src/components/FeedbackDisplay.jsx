import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  // 🔒 1️⃣ 피드백이 문자열인 경우 (정상 출력)
  if (typeof feedback === "string") {
    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 AI 피드백</h3>
        <p>{feedback}</p>
      </div>
    );
  }

  // 🔒 2️⃣ 피드백이 객체인 경우
  if (typeof feedback === "object" && feedback !== null) {
    // JSON 전체를 예쁘게 보기 (임시 fallback)
    const safePreview = JSON.stringify(feedback, null, 2);

    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 사고력 AI 피드백</h3>

        {/* === meta 섹션 === */}
        {"meta" in feedback && (
          <div className="feedback-meta">
            <p><strong>요약:</strong> {String(feedback.meta?.요약 || "-")}</p>
            <p><strong>톤:</strong> {String(feedback.meta?.톤 || "-")}</p>
            <p><strong>질문 수:</strong> {String(feedback.meta?.총_질문_개수 || 0)}</p>
          </div>
        )}

        {/* === 평가 섹션 === */}
        {"평가" in feedback && typeof feedback.평가 === "object" && (
          <div className="feedback-section">
            {Object.entries(feedback.평가).map(([key, val]) => {
              if (!val || typeof val !== "object") return null;
              return (
                <div key={key} className="feedback-card">
                  <h4>🧩 {String(key)}</h4>
                  {val.평가 && <p>💡 {String(val.평가)}</p>}
                  {val.질문 &&
                    (Array.isArray(val.질문)
                      ? val.질문.map((q, i) => <p key={i}>❓ {String(q)}</p>)
                      : <p>❓ {String(val.질문)}</p>)}
                </div>
              );
            })}
          </div>
        )}

        {/* === 다음 행동 === */}
        {Array.isArray(feedback["다음_행동(당장_실행_1~3개)"]) && (
          <div className="feedback-section">
            <h4>🚀 다음 행동</h4>
            <ul>
              {feedback["다음_행동(당장_실행_1~3개)"].map((item, i) => (
                <li key={i}>✅ {String(item)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* === 혹시 다른 구조의 객체일 경우 === */}
        {!("평가" in feedback) && !("meta" in feedback) && (
          <pre style={{ background: "#111", color: "#eee", padding: "12px" }}>
            {safePreview}
          </pre>
        )}
      </div>
    );
  }

  // 🔒 3️⃣ 안전한 fallback
  return (
    <div className="feedback-container">
      <h3 className="feedback-title">💬 AI 피드백</h3>
      <pre>{String(feedback)}</pre>
    </div>
  );
}
