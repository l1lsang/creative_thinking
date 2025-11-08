import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import "./AdminMindMap.css";

export default function AdminMindMap({ feedback }) {
  if (!feedback || typeof feedback !== "object") {
    return <p className="mindmap-empty">시각화할 AI 피드백이 없습니다 😢</p>;
  }

  const { meta, 평가, "다음_행동(당장_실행_1~3개)": next } = feedback;

  const nodes = [
    {
      id: "root",
      position: { x: 300, y: 0 },
      data: { label: `🧠 ${meta?.요약 || "요약 없음"}` },
      style: {
        background: "#1e3a8a",
        color: "white",
        borderRadius: 10,
        padding: 10,
        width: 280,
        textAlign: "center",
        whiteSpace: "pre-line",
      },
    },
  ];
  const edges = [];

  if (평가 && typeof 평가 === "object") {
    Object.entries(평가).forEach(([key, value], i) => {
      nodes.push({
        id: `eval-${i}`,
        position: { x: 0, y: 100 + i * 100 },
        data: { label: `📘 ${key}\n${value.평가 || ""}` },
        style: {
          background: "#f0f9ff",
          border: "1px solid #3b82f6",
          borderRadius: 8,
          padding: 8,
          width: 220,
          whiteSpace: "pre-line",
        },
      });
      edges.push({ id: `e-root-eval-${i}`, source: `eval-${i}`, target: "root", animated: true });
    });
  }

  if (next && Array.isArray(next)) {
    next.forEach((action, i) => {
      nodes.push({
        id: `next-${i}`,
        position: { x: 600, y: 100 + i * 100 },
        data: { label: `🚀 ${action}` },
        style: {
          background: "#dcfce7",
          border: "1px solid #22c55e",
          borderRadius: 8,
          padding: 8,
          width: 220,
        },
      });
      edges.push({
        id: `e-root-next-${i}`,
        source: "root",
        target: `next-${i}`,
        animated: true,
        style: { stroke: "#22c55e" },
      });
    });
  }

  return (
    <div className="mindmap-container">
      <h3 className="mindmap-title">🧭 사고 구조 시각화</h3>
      <div className="mindmap-flow">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap
            nodeColor={(n) => {
              if (n.id.startsWith("next")) return "#86efac";
              if (n.id.startsWith("eval")) return "#93c5fd";
              return "#818cf8";
            }}
          />
          <Controls />
          <Background gap={16} color="#ddd" />
        </ReactFlow>
      </div>
    </div>
  );
}
