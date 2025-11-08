import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import "./MindMap.css";

export default function MindMap({ form }) {
  if (!form) return null;

  // 🧠 form 데이터를 트리 구조로 변환
  const data = [
    {
      name: "목표 🎯",
      children: [
        {
          name: "사전사고 💡",
          children: [
            { name: `선행 지식: ${form.priorKnowledge || "없음"}` },
            { name: `예상 어려움: ${form.difficulty || "없음"}` },
          ],
        },
        {
          name: "사고과정 🔍",
          children: [
            { name: `전략: ${form.strategy || "없음"}` },
            { name: `분석: ${form.analysis || "없음"}` },
            { name: `협력: ${form.collaboration || "없음"}` },
          ],
        },
        {
          name: "사고 후 반성 🪞",
          children: [
            { name: `통찰: ${form.reflection || "없음"}` },
            {
              name: "비판적 사고 체크",
              children: Object.entries(form.criticalThinking || {}).map(
                ([key, value]) => ({
                  name: `${key}: ${value ? "✅" : "❌"}`,
                })
              ),
            },
          ],
        },
        {
          name: "실행계획 🗓️",
          children: [
            { name: `해야 할 일: ${form.todo || "없음"}` },
            { name: `기한: ${form.deadline || "없음"}` },
          ],
        },
      ],
    },
  ];

  return (
    <div className="mindmap-container">
      <h3 className="mindmap-title">🧭 사고 과정 마인드맵</h3>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={data}
          dataKey="size"
          ratio={4 / 3}
          stroke="#fff"
          fill="#60a5fa"
          content={<CustomNode />}
        >
          <Tooltip />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

// 🧩 커스텀 노드 렌더링
function CustomNode({ name, x, y, width, height }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth={2}
        rx={8}
      />
      <text
        x={x + 8}
        y={y + 20}
        fill="#fff"
        fontSize={12}
        style={{ pointerEvents: "none" }}
      >
        {name.length > 40 ? name.slice(0, 40) + "..." : name}
      </text>
    </g>
  );
}
