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

  // 점수 그래프 데이터
  const data = [
    { name: "논리적 사고력", value: feedback.logicScore || 70 },
    { name: "비판적 사고력", value: feedback.criticalScore || 60 },
    { name: "개선 가능성", value: feedback.improvementScore || 50 },
  ];
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  // 피드백 텍스트 생성 함수
  const renderTextFeedback = () => {
    const parts = [];

    // 1️⃣ 메타 요약
    if (feedback.meta?.요약) {
      parts.push(`🧭 ${feedback.meta.요약}`);
    }

    // 2️⃣ 평가 요약
    if (feedback.평가 && typeof feedback.평가 === "object") {
      parts.push("\n📋 **세부 피드백 요약**");
      Object.entries(feedback.평가).forEach(([key, section]) => {
        const title = key.replace(/\d+_|_/g, " ").trim();
        if (typeof section === "object") {
          let text = section.평가 || section.근거 || section.핵심정리 || "";
          const questions = Array.isArray(section.질문)
            ? section.질문.join(" / ")
            : "";
          parts.push(`\n🔹 ${title} → ${text}${questions ? ` (${questions})` : ""}`);
        }
      });
    }

    // 3️⃣ 다음 행동
    if (feedback["다음_행동(당장_실행_1~3개)"]) {
      const actions = feedback["다음_행동(당장_실행_1~3개)"]
        .map((a, i) => `➡️ ${a}`)
        .join("\n");
      parts.push(`\n🚀 **다음 실행 계획**\n${actions}`);
    }

    return parts.join("\n");
  };

  return (
    <div className="feedback-display">
      <h3>🤖 AI 피드백 요약</h3>

      {/* === 점수 차트 === */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* === 줄글 형태 피드백 === */}
      <div className="feedback-text">
        <p style={{ whiteSpace: "pre-wrap" }}>{renderTextFeedback()}</p>
      </div>
    </div>
  );
}
