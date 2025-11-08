import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import "./AdminDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminMindMap from "../components/AdminMindMap.jsx"; // 🧠 추가

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");

  // === Firestore에서 데이터 가져오기 ===
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const q = query(
          collection(db, "thinkingRecords"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(data);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
        alert("기록을 불러오는 중 오류가 발생했습니다 ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // === 점수 그래프용 데이터 ===
  const chartData = records
    .filter((r) => r.evaluation)
    .map((r) => ({
      name: r.topic || "제목 없음",
      점수: Number(r.evaluation),
    }));

  if (loading) return <p className="admin-loading">불러오는 중...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">🧭 관리자 대시보드</h1>
      <p className="admin-subtitle">
        총 {records.length}개의 사고 훈련 기록이 있습니다.
      </p>

      {/* === 점수 분포 그래프 === */}
      <div className="admin-chart-box">
        <h3>📊 학생별 평가 점수 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="점수" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* === 사고 기록 목록 === */}
      <div className="admin-records-list">
        {records.map((record) => (
          <div
            key={record.id}
            className="admin-record-card"
            onClick={() => setSelectedRecord(record)}
          >
            <h3>{record.topic || "제목 없음"}</h3>
            <p>
              <strong>작성자:</strong> {record.email || record.userId || "익명"}
            </p>
            <p>
              <strong>날짜:</strong> {record.date || "-"}
            </p>
            <p>
              <strong>평가 점수:</strong> {record.evaluation || "미입력"}
            </p>
          </div>
        ))}
      </div>

      {/* === 상세 보기 모달 === */}
      {selectedRecord && (
        <div className="record-modal">
          <div className="record-modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedRecord(null)}
            >
              닫기 ✖
            </button>

            <h2>🧠 {selectedRecord.topic || "제목 없음"}</h2>
            <p>
              <strong>작성자:</strong> {selectedRecord.email}
            </p>
            <p>
              <strong>날짜:</strong> {selectedRecord.date}
            </p>
            <p>
              <strong>문제 유형:</strong>{" "}
              {selectedRecord.problemType?.join(", ")}
            </p>
            <p>
              <strong>목표:</strong> {selectedRecord.goal}
            </p>
            <p>
              <strong>전략:</strong> {selectedRecord.strategy}
            </p>
            <p>
              <strong>근거:</strong> {selectedRecord.sources}
            </p>
            <p>
              <strong>분석:</strong> {selectedRecord.analysis}
            </p>
            <p>
              <strong>협력:</strong> {selectedRecord.collaboration}
            </p>
            <p>
              <strong>통찰:</strong> {selectedRecord.reflection}
            </p>
            <p>
              <strong>어려움:</strong> {selectedRecord.difficulty}
            </p>
            <p>
              <strong>감정:</strong> {selectedRecord.emotion}
            </p>
            <p>
              <strong>장기적 성찰:</strong>{" "}
              {selectedRecord.longTermMeaning}
            </p>
            <p>
              <strong>실행 계획:</strong> {selectedRecord.todo}
            </p>
            <p>
              <strong>기한:</strong> {selectedRecord.deadline}
            </p>

            {/* === AI 피드백 === */}
            {selectedRecord.aiFeedback && (
              <>
                <h3>🤖 AI 피드백</h3>
                {(() => {
                  try {
                    let parsed = selectedRecord.aiFeedback;
                    if (typeof parsed === "string") {
                      try {
                        parsed = JSON.parse(parsed);
                      } catch {}
                    }

                    if (parsed && typeof parsed === "object") {
                      return (
                        <>
                          <pre className="ai-feedback-box">
                            {JSON.stringify(parsed, null, 2)}
                          </pre>

                          {/* 🧭 사고 구조 시각화 */}
                          <AdminMindMap feedback={parsed} />
                        </>
                      );
                    }
                    return (
                      <pre className="ai-feedback-box">
                        {String(parsed)}
                      </pre>
                    );
                  } catch (err) {
                    console.error("⚠️ 관리자 AI 피드백 렌더링 오류:", err);
                    return (
                      <pre className="ai-feedback-box">
                        {String(selectedRecord.aiFeedback)}
                      </pre>
                    );
                  }
                })()}
              </>
            )}

            {/* === AI 점수 섹션 === */}
            {(selectedRecord.logicScore ||
              selectedRecord.criticalScore ||
              selectedRecord.improvementScore) && (
              <div className="score-section">
                <h3>📈 AI 분석 점수</h3>
                <p>논리적 사고력: {selectedRecord.logicScore || "-"}점</p>
                <p>비판적 사고력: {selectedRecord.criticalScore || "-"}점</p>
                <p>개선 제안 점수: {selectedRecord.improvementScore || "-"}점</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
