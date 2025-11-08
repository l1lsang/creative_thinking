import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="feedback-display">
      <h2 className="feedback-title">🤖 AI 사고 피드백</h2>

      {/* 줄바꿈, 문단 유지 */}
      <div className="feedback-text">
        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
          {feedback}
        </p>
      </div>
    </div>
  );
}

