import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  // ✅ 타입 분기 (문자열 vs 객체)
  if (typeof feedback === "string") {
    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 AI 피드백</h3>
        <p>{feedback}</p>
      </div>
    );
  }

  // ✅ 객체일 경우 — React는 객체 자체를 렌더링할 수 없으므로 안전한 렌더링으로 전환
  if (typeof feedback === "object") {
    const keys = Object.keys(feedback);

    // 1️⃣ meta/평가 구조 (새 스키마)
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

          {평가 && typeof 평가 === "object" && (
            <div className="feedback-section">
              {Object.entries(평가).map(([k, v]) => (
                <div key={k} className="feedback-card">
                  <h4>{k}</h4>
                  {typeof v === "object" ? (
                    <>
                      {v.평가 && <p><strong>평가:</strong> {v.평가}</p>}
                      {v.질문 && (
                        Array.isArray(v.질문)
                          ? v.질문.map((q, i) => <p key={i}>❓ {q}</p>)
                          : <p>❓ {v.질문}</p>
                      )}
                    </>
                  ) : (
                    <p>{String(v)}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {nextActions && Array.isArray(nextActions) && (
            <div className="feedback-section">
              <h4>🚀 다음 행동</h4>
              <ul>
                {nextActions.map((item, i) => (
                  <li key={i}>✅ {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // 2️⃣ “목표_구체성_평가” 등 단일 키 구조 (간단 JSON)
    const feedbackKeys = keys.filter((k) => k !== "다음_행동");

    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 사고력 AI 피드백</h3>

        {feedbackKeys.map((key) => {
          const section = feedback[key];
          if (!section || typeof section !== "object") return null;

          return (
            <div key={key} className="feedback-card">
              <h4>🧩 {key}</h4>
              {section.질문 && <p>❓ {String(section.질문)}</p>}
              {section.피드백 && <p>💡 {String(section.피드백)}</p>}
            </div>
          );
        })}

        {Array.isArray(feedback.다음_행동) && (
          <div className="feedback-section">
            <h4>🚀 다음 행동</h4>
            <ul>
              {feedback.다음_행동.map((x, i) => (
                <li key={i}>✅ {x}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ✅ 혹시 모르는 다른 타입 대비
  return (
    <div className="feedback-container">
      <h3 className="feedback-title">💬 AI 피드백</h3>
      <p>{String(feedback)}</p>
    </div>
  );
}
