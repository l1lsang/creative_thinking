import React, { useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import "./MindMap.css";

export default function MindMap({ feedback }) {
  if (!feedback || typeof feedback !== "object") {
    return <p>시각화할 피드백이 없습니다 🪄</p>;
  }

  const nodes = useMemo(() => {
    const list = [];

    // 중심 노드
    list.push({
      id: "root",
      data: { label: "🧠 사고 피드백 흐름" },
      position: { x: 0, y: 0 },
      style: { background: "#2563eb", color: "#fff", borderRadius: 8, padding: 10 },
    });

    // 주요 평가 항목 노드
    if (feedback.평가) {
      Object.entries(feedback.평가).forEach(([key, val], idx) => {
        list.push({
          id: `node-${idx}`,
          data: { label: `${key.replaceAll("_", " ")}\n${val.평가 || ""}` },
          position: { x: 100 * Math.cos(idx * 0.6), y: 100 * Math.sin(idx * 0.6) + 100 },
          style: {
            background: "#f0f9ff",
            border: "2px solid #3b82f6",
            borderRadius: 10,
            padding: 8,
            whiteSpace: "pre-wrap",
            width: 200,
          },
        });
      });
    }

    // 다음 행동 노드
    if (Array.isArray(feedback["다음_행동(당장_실행_1~3개)"])) {
      feedback["다음_행동(당장_실행_1~3개)"].forEach((step, i) => {
        list.push({
          id: `action-${i}`,
          data: { label: `🚀 ${step}` },
          position: { x: i * 160 - 160, y: 320 },
          style: {
            background: "#dcfce7",
            border: "2px solid #16a34a",
            borderRadius: 8,
            padding: 6,
            fontSize: 13,
          },
        });
      });
    }

    return list;
  }, [feedback]);

  const edges = useMemo(() => {
    const base = [];
    nodes.forEach((node) => {
      if (node.id !== "root") {
        base.push({ id: `e-root-${node.id}`, source: "root", target: node.id, animated: true });
      }
    });
    return base;
  }, [nodes]);

  return (
    <div className="mindmap-container" style={{ width: "100%", height: "500px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background gap={12} color="#eee" />
      </ReactFlow>
    </div>
  );
}
