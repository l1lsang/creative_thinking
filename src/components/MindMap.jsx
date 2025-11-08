// src/components/MindMap.jsx
import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

export default function MindMap({ form }) {
  if (!form) return null;

  const category = form.category || "선택 없음";
  const subCategory = form.subCategory || [];
  const problemType = form.problemType || [];

  // 🌿 커스텀 노드 (모양/색/애니메이션)
  const CustomNode = ({ data }) => (
    <div
      style={{
        background: data.level === "root" ? "var(--accent)" : "var(--card-bg)",
        color: data.level === "root" ? "white" : "var(--text-light)",
        border:
          data.level === "leaf"
            ? "1.5px dashed var(--accent)"
            : "2px solid var(--accent)",
        padding: "10px 15px",
        borderRadius: 12,
        fontWeight: 600,
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        width: 220,
        whiteSpace: "pre-wrap",
      }}
    >
      {data.label}
      <Handle type="target" position="top" style={{ opacity: 0 }} />
      <Handle type="source" position="bottom" style={{ opacity: 0 }} />
    </div>
  );

  // 🧩 노드 구성
  const nodes = useMemo(() => {
    const nodesArr = [];
    const baseX = 300;
    const baseY = 100;

    // 1️⃣ 문학/비문학
    nodesArr.push({
      id: "root",
      type: "custom",
      position: { x: baseX, y: baseY },
      data: { label: `📚 ${category}`, level: "root" },
    });

    // 2️⃣ 이해/시간/적용
    subCategory.forEach((sub, i) => {
      nodesArr.push({
        id: `sub-${i}`,
        type: "custom",
        position: { x: baseX - 200 + i * 200, y: baseY + 160 },
        data: { label: `🧠 ${sub}`, level: "branch" },
      });
    });

    // 3️⃣ 세부유형
    let idx = 0;
    subCategory.forEach((sub, i) => {
      problemType.forEach((p, j) => {
        nodesArr.push({
          id: `leaf-${idx}`,
          type: "custom",
          position: {
            x: baseX - 300 + i * 250,
            y: baseY + 320 + j * 100,
          },
          data: { label: `🔹 ${p}`, level: "leaf" },
        });
        idx++;
      });
    });

    return nodesArr;
  }, [category, subCategory, problemType]);

  // 🌈 엣지 구성
  const edges = useMemo(() => {
    const edgeArr = [];
    subCategory.forEach((_, i) => {
      edgeArr.push({
        id: `e-root-${i}`,
        source: "root",
        target: `sub-${i}`,
        style: { stroke: "var(--accent)", strokeWidth: 2 },
      });
    });

    let idx = 0;
    subCategory.forEach((_, i) => {
      problemType.forEach(() => {
        edgeArr.push({
          id: `e-sub-${i}-${idx}`,
          source: `sub-${i}`,
          target: `leaf-${idx}`,
          style: { stroke: "var(--accent)", strokeWidth: 1.5 },
        });
        idx++;
      });
    });

    return edgeArr;
  }, [subCategory, problemType]);

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        marginTop: "30px",
        borderRadius: "10px",
        background: "var(--bg-light)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          color: "var(--accent)",
          paddingTop: "10px",
        }}
      >
        🌳 사고 유형 마인드맵
      </h3>

      <ReactFlow
        nodeTypes={{ custom: CustomNode }}
        nodes={nodes}
        edges={edges}
        fitView
      >
        <MiniMap
          nodeColor={(n) =>
            n.data.level === "root"
              ? "#2563eb"
              : n.data.level === "branch"
              ? "#60a5fa"
              : "#a5b4fc"
          }
        />
        <Controls />
        <Background color="#e5e7eb" gap={18} />
      </ReactFlow>
    </div>
  );
}
