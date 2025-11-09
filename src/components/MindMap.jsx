import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

export default function MindMap({ form, aiMap }) {
  if (!form) return null;

  const category = form.category || "선택 없음";
  const subCategory = form.subCategory || [];
  const problemType = form.problemType || [];

  // 🌿 커스텀 노드
  const CustomNode = ({ data }) => (
    <div
      style={{
        background: data.level === "root" ? "#2563eb" : "white",
        color: data.level === "root" ? "white" : "#1f2937",
        border: data.level === "leaf"
          ? "1.5px dashed #60a5fa"
          : "2px solid #2563eb",
        padding: "10px 15px",
        borderRadius: 12,
        fontWeight: 600,
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: 200,
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

    // 선택 기반 루트
    nodesArr.push({
      id: "root",
      type: "custom",
      position: { x: baseX, y: baseY },
      data: { label: `📚 ${category}`, level: "root" },
    });

    // 이해/시간/적용
    subCategory.forEach((sub, i) => {
      nodesArr.push({
        id: `sub-${i}`,
        type: "custom",
        position: { x: baseX - 200 + i * 200, y: baseY + 160 },
        data: { label: `🧠 ${sub}`, level: "branch" },
      });
    });

    // 세부 유형
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

    // 🧠 AI 마인드맵도 아래쪽에 추가
    if (aiMap && aiMap.length > 0) {
      aiMap.forEach((line, i) => {
        nodesArr.push({
          id: `ai-${i}`,
          type: "custom",
          position: { x: baseX + 400, y: baseY + i * 80 },
          data: { label: `🤖 ${line}`, level: "branch" },
        });
      });
    }

    return nodesArr;
  }, [category, subCategory, problemType, aiMap]);

  // 🌈 엣지 구성
  const edges = useMemo(() => {
    const edgeArr = [];

    subCategory.forEach((_, i) => {
      edgeArr.push({
        id: `e-root-${i}`,
        source: "root",
        target: `sub-${i}`,
        style: { stroke: "#2563eb", strokeWidth: 2 },
      });
    });

    let idx = 0;
    subCategory.forEach((_, i) => {
      problemType.forEach(() => {
        edgeArr.push({
          id: `e-sub-${i}-${idx}`,
          source: `sub-${i}`,
          target: `leaf-${idx}`,
          style: { stroke: "#60a5fa", strokeWidth: 1.5 },
        });
        idx++;
      });
    });

    // AI 마인드맵 연결
    if (aiMap && aiMap.length > 0) {
      aiMap.forEach((_, i) => {
        edgeArr.push({
          id: `e-ai-${i}`,
          source: "root",
          target: `ai-${i}`,
          style: { stroke: "#22d3ee", strokeWidth: 2, strokeDasharray: "5 5" },
        });
      });
    }

    return edgeArr;
  }, [subCategory, problemType, aiMap]);

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        marginTop: "30px",
        borderRadius: "10px",
        background: "#f8fafc",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          color: "#2563eb",
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
            n.id.startsWith("ai")
              ? "#22d3ee"
              : n.data.level === "root"
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
