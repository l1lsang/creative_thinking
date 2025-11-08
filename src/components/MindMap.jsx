import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

export default function MindMap({ feedback }) {
  if (!feedback || typeof feedback !== "object") {
    return <p className="mindmap-empty">시각화할 데이터가 없습니다 😢</p>;
  }

  // 🔹 JSON 구조에서 주요 섹션 추출
  const { meta, 평가, "다음_행동(당장_실행_1~3개)": nextActions } = feedback;

  // 🔹 노드 ID 자동 생성용
  const makeId = (prefix, index) => `${prefix}-${index}`;

  // 🔹 루트 노드
  const nodes = [
    {
      id: "root",
      type: "default",
      position: { x: 250, y: 0 },
      data: {
        label: `🧠 사고 피드백 요약\n\n${meta?.요약 || "요약 없음"}`,
      },
      style: {
        background: "#1e3a8a",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        width: 300,
        textAlign: "center",
        whiteSpace: "pre-line",
      },
    },
  ];

  const edges = [];

  // 🔹 주요 평가 항목을 노드화
  if (평가 && typeof 평가 === "object") {
    let y = 150;
    Object.entries(평가).forEach(([key, value], i) => {
      const nodeId = makeId("eval", i);
      nodes.push({
        id: nodeId,
        type: "default",
        position: { x: 100 * (i % 4), y },
        data: {
          label: `📘 ${key}\n${value.평가 || ""}`,
        },
        style: {
          background: "#f8fafc",
          border: "1px solid #93c5fd",
          borderRadius: 8,
          padding: 8,
          width: 220,
          whiteSpace: "pre-line",
        },
      });
      edges.push({
        id: `e-root-${nodeId}`,
        source: "root",
        target: nodeId,
        animated: true,
      });
      y += 120;
    });
  }

  // 🔹 다음 행동 노드
  if (nextActions && Array.isArray(nextActions)) {
    nextActions.forEach((action, i) => {
      const nodeId = makeId("next", i);
      nodes.push({
        id: nodeId,
        type: "default",
        position: { x: 400, y: 180 + i * 100 },
        data: { label: `🚀 ${action}` },
        style: {
          background: "#dcfce7",
          border: "1px solid #22c55e",
          borderRadius: 8,
          padding: 8,
          width: 200,
        },
      });
      edges.push({
        id: `e-root-${nodeId}`,
        source: "root",
        target: nodeId,
        animated: true,
        style: { stroke: "#22c55e" },
      });
    });
  }

  const onConnect = useCallback(
    (params) => console.log("connect", params),
    []
  );

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onConnect={onConnect}
        attributionPosition="bottom-right"
      >
        <MiniMap
          nodeColor={(node) => {
            if (node.id.startsWith("next")) return "#86efac";
            if (node.id.startsWith("eval")) return "#93c5fd";
            return "#818cf8";
          }}
        />
        <Controls />
        <Background gap={16} color="#ddd" />
      </ReactFlow>
    </div>
  );
}
