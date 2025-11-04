import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) return null;

  // GPT 피드백을 섹션별로 나누기
  const sections = feedback
    .split(/\d️⃣/)
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim());

  // 임시 데이터 (AI 분석 수치 예시)
  // 나중에 OpenAI가 점수를 함께 반환하면 여기에 반영하면 됨
  const chartData = [
    { name: "논리적 강점", value: 75 },
    { name: "비판적 사고 포인트", value: 60 },
    { name: "개선 방향", value: 45 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="feedback-container">
      <h3 className="feedback-title">💬 AI 피드백 요약</h3>

      {/* === 그래프 === */}
      <div className="feedback-chart">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* === 피드백 텍스트 === */}
      {sections.length > 0 ? (
        sections.map((section, i) => {
          const [title, ...content] = section.split("\n");
          return (
            <div key={i} className="feedback-section">
              <h4>{title}</h4>
              <p>{content.join("\n")}</p>
            </div>
          );
        })
      ) : (
        <p>AI 피드백을 불러오는 중이에요...</p>
      )}
    </div>
  );
}
