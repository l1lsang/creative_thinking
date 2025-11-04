import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase.js";
import { getAdminSummary } from "../openai.js";
import "./AdminDashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      const q = query(collection(db, "thinkingRecords"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
      setLoading(false);
    };
    fetchRecords();
  }, []);

  // ✅ AI 요약 생성
  const generateSummary = async () => {
    setAiLoading(true);
    const result = await getAdminSummary(records);
    setSummary(result);
    setAiLoading(false);
  };

  if (loading) return <p className="admin-loading">로딩 중...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">🧠 사고력 훈련 관리자 대시보드</h1>
      <p className="admin-subtitle">전체 학습자 {records.length}명 기록 요약</p>

      {/* ✅ AI 종합 요약 섹션 */}
      <section className="admin-summary-card">
        <h2>🤖 AI 종합 피드백 요약</h2>
        {summary ? (
          <p className="summary-text">{summary}</p>
        ) : (
          <button onClick={generateSummary} className="summary-btn">
            {aiLoading ? "요약 중..." : "AI 요약 생성하기"}
          </button>
        )}
      </section>

      <div className="admin-chart-section">
        <h2>💬 평가 점수 분포</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={aggregateByEvaluation(records)}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-list-section">
        <h2>🧾 최근 제출된 사고 기록</h2>
        {records.map((r) => (
          <div key={r.id} className="admin-record-card">
            <h3>{r.topic || "제목 없음"}</h3>
            <p><strong>작성자:</strong> {r.email || r.userId}</p>
            <p><strong>평가 점수:</strong> {r.evaluation || "미입력"}</p>
            <p><strong>목표:</strong> {r.goal?.slice(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function aggregateByEvaluation(records) {
  const counts = [1, 2, 3, 4, 5].map((n) => ({
    label: `${n}점`,
    count: records.filter((r) => r.evaluation === String(n)).length,
  }));
  return counts;
}
