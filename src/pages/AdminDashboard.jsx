// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { getAdminSummary } from "../openai.js";
import "./AdminDashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); // ✅ 상세보기 상태 추가

  // ✅ Firestore에서 사고 기록 불러오기
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

  // ✅ AI 종합 요약 생성
  const generateSummary = async () => {
    setAiLoading(true);
    const result = await getAdminSummary(records);
    setSummary(result);
    setAiLoading(false);
  };

  // ✅ 특정 기록 상세보기
  const handleRecordClick = async (recordId) => {
    const docRef = doc(db, "thinkingRecords", recordId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedRecord({ id: docSnap.id, ...docSnap.data() });
    }
  };

  // ✅ 목록으로 돌아가기
  const handleBack = () => {
    setSelectedRecord(null);
  };

  if (loading) return <p className="admin-loading">로딩 중...</p>;

  // ✅ 상세보기 모드
  if (selectedRecord) {
    const r = selectedRecord;
    return (
      <div className="record-detail-container">
        <button onClick={handleBack} className="back-btn">← 목록으로</button>
        <h1 className="record-title">{r.topic || "제목 없음"}</h1>
        <p className="record-author"><strong>작성자:</strong> {r.email || r.userId}</p>
        {r.createdAt && (
          <p className="record-date">
            <strong>작성일:</strong>{" "}
            {new Date(r.createdAt.seconds * 1000).toLocaleString()}
          </p>
        )}

        <section className="record-section">
          <h2>🎯 목표</h2>
          <p>{r.goal || "작성된 목표가 없습니다."}</p>
        </section>

        <section className="record-section">
          <h2>💭 사고 과정</h2>
          <p>{r.thinkingProcess || "내용 없음"}</p>
        </section>

        <section className="record-section">
          <h2>🔍 반성 및 성찰</h2>
          <p>{r.reflection || "내용 없음"}</p>
        </section>

        <section className="record-section">
          <h2>🧠 AI 피드백</h2>
          <div className="ai-feedback-box">
            {r.aiFeedback ? <pre>{r.aiFeedback}</pre> : <p>아직 피드백이 없습니다.</p>}
          </div>
        </section>
      </div>
    );
  }

  // ✅ 기본 관리자 대시보드 화면
  return (
    <div className="admin-container">
      <h1 className="admin-title">🧠 사고력 훈련 관리자 대시보드</h1>
      <p className="admin-subtitle">전체 학습자 {records.length}명 기록 요약</p>

      {/* ✅ AI 종합 요약 */}
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

      {/* ✅ 평가 점수 분포 */}
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

      {/* ✅ 기록 리스트 */}
      <div className="admin-list-section">
        <h2>🧾 최근 제출된 사고 기록</h2>
        {records.map((r) => (
          <div
            key={r.id}
            className="admin-record-card"
            onClick={() => handleRecordClick(r.id)}
            style={{ cursor: "pointer" }}
          >
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

// ✅ 점수별 데이터 집계 함수
function aggregateByEvaluation(records) {
  const counts = [1, 2, 3, 4, 5].map((n) => ({
    label: `${n}점`,
    count: records.filter((r) => r.evaluation === String(n)).length,
  }));
  return counts;
}
