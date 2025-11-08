// src/components/MindMap.jsx
import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

export default function MindMap({ aiFeedback }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!aiFeedback || typeof aiFeedback !== "object") return;

    const newNodes = [];
    const newEdges = [];
    let yOffset = 0;

    // === 루트 노드 ===
    newNodes.push({
      id: "root",
      position: { x: 300, y: 0 },
      data: { label: "🧠 사고 피드백 구조" },
      style: {
        background: "#2563eb",
        color: "white",
        padding: 10,
        borderRadius: 8,
        fontWeight: 600,
      },
    });

    // === 주요 평가 항목들 ===
    Object.entries(aiFeedback.평가 || {}).forEach(([key, value], i) => {
      const nodeId = `node-${i}`;
      newNodes.push({
        id: nodeId,
        position: { x: 100 + i * 200, y: 150 },
        data: { label: `📍 ${key}` },
        style: {
          background: "#e0f2fe",
          border: "1px solid #93c5fd",
          borderRadius: 8,
          padding: 8,
        },
      });
      newEdges.push({ id: `edge-root-${i}`, source: "root", target: nodeId });

      // === 세부 내용 노드 (예: 질문, 평가, 개선제안 등) ===
      if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subVal], j) => {
          const subId = `${nodeId}-${j}`;
          newNodes.push({
            id: subId,
            position: { x: 50 + i * 200, y: 300 + j * 100 },
            data: {
              label: `${subKey}: ${
                typeof subVal === "string" ? subVal.slice(0, 40) + "..." : ""
              }`,
            },
            style: {
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              borderRadius: 6,
              padding: 6,
            },
          });
          newEdges.push({ id: `edge-${nodeId}-${j}`, source: nodeId, target: subId });
        });
      }
      yOffset += 150;
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [aiFeedback]);

  if (!aiFeedback) return <p>🤖 아직 피드백 데이터가 없습니다.</p>;

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        🗺️ 사고 피드백 마인드맵
      </h3>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
