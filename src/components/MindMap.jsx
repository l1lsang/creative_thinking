import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

export default function MindMap({ aiFeedback }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!aiFeedback || !aiFeedback.평가) return;

    const newNodes = [
      {
        id: "root",
        position: { x: 250, y: 0 },
        data: { label: "🧭 사고 흐름" },
        style: {
          background: "#2563eb",
          color: "#fff",
          padding: 10,
          borderRadius: 8,
        },
      },
    ];
    const newEdges = [];

    let index = 0;
    for (const key in aiFeedback.평가) {
      const id = `n${index}`;
      newNodes.push({
        id,
        position: { x: 100 + index * 200, y: 150 },
        data: { label: key },
        style: {
          background: "#e0f2fe",
          border: "1px solid #60a5fa",
          padding: 8,
          borderRadius: 6,
        },
      });
      newEdges.push({ id: `e-root-${id}`, source: "root", target: id });
      index++;
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [aiFeedback]);

  if (!aiFeedback) return null;

  return (
    <div style={{ width: "100%", height: "600px", marginTop: "2rem" }}>
      <h3 style={{ textAlign: "center" }}>🗺️ 사고 과정 마인드맵</h3>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background color="#ddd" gap={16} />
      </ReactFlow>
    </div>
  );
}
