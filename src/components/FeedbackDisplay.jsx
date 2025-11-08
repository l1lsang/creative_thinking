import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./FeedbackDisplay.css";

export default function FeedbackDisplay({ feedback, scores }) {
  // feedback이 없으면 표시하지 않음
  if (!feedback) return null;

  // GPT 피드백을 구분 (예: 1️⃣ 2️⃣ 3️⃣ 로 나뉜 섹션)
  const sections = feedback
    .split(/\d️⃣/)
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim());

  // 점수 데이터 (기본값 포함)
  const chartData = [
    { name: "논리적 사고력", value: scores?.logicScore || 0 },
    { name: "비판적 사고력", value: scores?.criticalScore || 0 },
    { name: "개선 방향", value: scores?.improvementScore || 0 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="feedback-container">
      <h3 className="feedback-title">💬 AI 피드백 요약</h3>

      {/* === 원형 그래프 === */}
      <div className="feedback-chart">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}점`} />
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
        <p className="feedback-loading">AI 피드백을 불러오는 중이에요...</p>
      )}
    </div>
  );
}
