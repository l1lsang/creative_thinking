import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  // 기본 점수 값
  const data = [
    { name: "논리적 사고력", value: feedback.logicScore || 70 },
    { name: "비판적 사고력", value: feedback.criticalScore || 65 },
    { name: "개선 가능성", value: feedback.improvementScore || 60 },
  ];
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="feedback-display">
      <h2>🤖 AI 사고 피드백</h2>

      {/* === 1️⃣ 점수 그래프 === */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* === 2️⃣ 텍스트 피드백 === */}
      <div className="feedback-text">
        {feedback.summary && (
          <section className="feedback-section">
            <h3>🧭 전체 요약</h3>
            <p>{feedback.summary}</p>
          </section>
        )}

        {feedback.goalFeedback && (
          <section className="feedback-section">
            <h3>🎯 목표 설정</h3>
            <p>{feedback.goalFeedback}</p>
          </section>
        )}

        {feedback.strategyFeedback && (
          <section className="feedback-section">
            <h3>🧩 전략 및 활동</h3>
            <p>{feedback.strategyFeedback}</p>
          </section>
        )}

        {feedback.reflectionFeedback && (
          <section className="feedback-section">
            <h3>💭 사고 후 반성</h3>
            <p>{feedback.reflectionFeedback}</p>
          </section>
        )}

        {feedback.suggestions && (
          <section className="feedback-section">
            <h3>🚀 개선 제안</h3>
            <ul>
              {feedback.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {feedback.growthDirection && (
          <section className="feedback-section">
            <h3>🌱 성장 방향</h3>
            <p>{feedback.growthDirection}</p>
          </section>
        )}
      </div>
    </div>
  );
}
