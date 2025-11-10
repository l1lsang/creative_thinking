import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MyRecords.css";

export default function MyRecords({ user }) {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "thinkingRecords"),
          where("userId", "==", user.id),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setRecords(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("기록 불러오기 오류:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <p className="loading">불러오는 중...</p>;

  return (
    <div className="records-container">
      <h2 className="records-title">📚 나의 사고 기록 ({records.length})</h2>

      {records.length === 0 ? (
        <p className="no-records">아직 저장된 기록이 없습니다.</p>
      ) : (
        <div className="records-grid">
          {records.map((r) => (
            <div
              key={r.id}
              className="record-card"
              onClick={() => setSelected(r)}
            >
              <div className="record-header">
                <h4>{r.topic || "제목 없음"}</h4>
                <p className="record-date">
                  {r.createdAt?.seconds
                    ? new Date(r.createdAt.seconds * 1000).toLocaleDateString()
                    : "날짜 없음"}
                </p>
              </div>
              <p className="record-category">
                {r.category || "분류 없음"} · {r.subCategory?.join(", ") || "없음"}
              </p>
              <p className="record-goal">
                🎯 {r.goal?.slice(0, 40) || "목표 없음"}
                {r.goal?.length > 40 ? "..." : ""}
              </p>

              {typeof r.aiFeedback === "string" && (
                <div className="record-feedback-preview markdown-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {r.aiFeedback.length > 180
                      ? r.aiFeedback.slice(0, 180) + "..."
                      : r.aiFeedback}
                  </ReactMarkdown>
                </div>
              )}
              {!r.aiFeedback && (
                <p className="record-feedback-none">🤖 AI 피드백 없음</p>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelected(null)}>
              ✖ 닫기
            </button>
            <h3>{selected.topic}</h3>
            <p><b>문제 영역:</b> {selected.category}</p>
            <p><b>사고 초점:</b> {selected.subCategory?.join(", ")}</p>
            <p><b>세부 유형:</b> {selected.problemType?.join(", ")}</p>
            <p><b>목표:</b> {selected.goal}</p>
            <p><b>전략:</b> {selected.strategy}</p>
            <p><b>성찰:</b> {selected.reflection}</p>
            <p><b>어려움:</b> {selected.difficulty}</p>

            {typeof selected.aiFeedback === "string" && (
              <>
                <h4 className="ai-feedback-title">🤖 AI 피드백</h4>
                <div className="ai-feedback-box markdown-full">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selected.aiFeedback}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
