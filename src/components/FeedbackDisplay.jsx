import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  // ✅ 문자열 피드백 (기본 fallback)
  if (typeof feedback === "string") {
    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 AI 피드백</h3>
        <p>{feedback}</p>
      </div>
    );
  }

  // ✅ JSON 객체인 경우
  const keys = Object.keys(feedback);

  // 1️⃣ "meta" + "평가" 구조 (새 스키마)
  if (keys.includes("meta") && keys.includes("평가")) {
    const { meta, 평가, ["다음_행동(당장_실행_1~3개)"]: nextActions } = feedback;
    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 사고력 AI 피드백</h3>

        {meta && (
          <div className="feedback-meta">
            <p><strong>요약:</strong> {meta.요약}</p>
            <p><strong>톤:</strong> {meta.톤}</p>
            <p><strong>질문 수:</strong> {meta.총_질문_개수}</p>
          </div>
        )}

        {평가 && (
          <div className="feedback-section">
            {Object.entries(평가).map(([k, v]) => (
              <div key={k} className="feedback-card">
                <h4>{k}</h4>
                {v.평가 && <p><strong>평가:</strong> {v.평가}</p>}
                {v.개선제안 && <p>💡 {v.개선제안}</p>}
                {v.질문 && (
                  Array.isArray(v.질문)
                    ? v.질문.map((q, i) => <p key={i}>❓ {q}</p>)
                    : <p>❓ {v.질문}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {nextActions && (
          <div className="feedback-section">
            <h4>🚀 다음 행동</h4>
            <ul>{nextActions.map((x, i) => <li key={i}>✅ {x}</li>)}</ul>
          </div>
        )}
      </div>
    );
  }

  // 2️⃣ "목표_구체성_평가" 구조 (단순 JSON 구조)
  const feedbackKeys = keys.filter((k) => k !== "다음_행동");

  return (
    <div className="feedback-container">
      <h3 className="feedback-title">💬 사고력 AI 피드백</h3>

      {feedbackKeys.map((key) => {
        const section = feedback[key];
        return (
          <div key={key} className="feedback-card">
            <h4>🧩 {key}</h4>
            {section.질문 && <p>❓ <strong>{section.질문}</strong></p>}
            {section.피드백 && <p>💡 {section.피드백}</p>}
          </div>
        );
      })}

      {feedback.다음_행동 && (
        <div className="feedback-section">
          <h4>🚀 다음 행동 제안</h4>
          <ul>
            {feedback.다음_행동.map((item, i) => (
              <li key={i}>✅ {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
