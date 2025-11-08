import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  // ✅ 문자열인지, 객체(JSON)인지 구분
  if (typeof feedback === "string") {
    return (
      <div className="feedback-container">
        <h3 className="feedback-title">💬 AI 피드백 요약</h3>
        <p>{feedback}</p>
      </div>
    );
  }

  const { meta, 평가, ["다음_행동(당장_실행_1~3개)"]: nextActions, 다음_행동 } = feedback;

  return (
    <div className="feedback-container">
      <h3 className="feedback-title">💬 AI 피드백 요약</h3>

      {/* === 메타 정보 === */}
      {meta && (
        <div className="feedback-meta">
          <p><strong>요약:</strong> {meta.요약}</p>
          <p><strong>톤:</strong> {meta.톤}</p>
          <p><strong>질문 수:</strong> {meta.총_질문_개수}</p>
        </div>
      )}

      {/* === 평가 항목 === */}
      {평가 ? (
        <div className="feedback-section">
          <h4>🧩 세부 평가 항목</h4>
          {Object.entries(평가).map(([key, val]) => (
            <div key={key} className="feedback-card">
              <h5>{key}</h5>
              {val.평가 && <p><strong>평가:</strong> {val.평가}</p>}
              {val.개선제안 && <p><strong>개선 제안:</strong> {val.개선제안}</p>}
              {val.질문 && Array.isArray(val.질문) && (
                <ul>
                  {val.질문.map((q, i) => (
                    <li key={i}>❓ {q}</li>
                  ))}
                </ul>
              )}
              {/* JSON 구조 단순화 대응 */}
              {val.질문 && typeof val.질문 === "string" && (
                <p>❓ {val.질문}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>세부 평가 데이터를 불러올 수 없습니다.</p>
      )}

      {/* === 다음 행동 === */}
      {(nextActions || 다음_행동) && (
        <div className="feedback-section">
          <h4>🚀 다음 행동 제안</h4>
          <ul>
            {(nextActions || 다음_행동).map((item, i) => (
              <li key={i}>✅ {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
