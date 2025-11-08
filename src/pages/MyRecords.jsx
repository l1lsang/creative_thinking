// src/pages/MyRecords.jsx
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import "./MyRecords.css";

export default function MyRecords({ user }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRecords = async () => {
      try {
        const q = query(
          collection(db, "thinkingRecords"),
          where("userId", "==", user.id),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(data);
      } catch (error) {
        console.error("기록 불러오기 오류:", error);
        alert("기록을 불러오는 중 오류가 발생했습니다 ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  if (loading) return <p className="myrecords-loading">불러오는 중...</p>;

  return (
    <div className="myrecords-container">
      <h1 className="myrecords-title">📘 나의 사고 기록</h1>
      <p className="myrecords-subtitle">총 {records.length}개의 기록이 있습니다.</p>

      <div className="myrecords-list">
        {records.map((record) => (
          <div
            key={record.id}
            className="myrecords-card"
            onClick={() => setSelectedRecord(record)}
          >
            <h3>{record.topic || "제목 없음"}</h3>
            <p><strong>날짜:</strong> {record.date || "-"}</p>
            <p><strong>평가 점수:</strong> {record.evaluation || "미입력"}</p>
            <p className="ellipsis"><strong>목표:</strong> {record.goal}</p>
          </div>
        ))}
      </div>

      {/* ✅ 선택된 기록 상세 보기 모달 */}
      {selectedRecord && (
        <div className="record-modal">
          <div className="record-modal-content">
            <button className="close-btn" onClick={() => setSelectedRecord(null)}>닫기 ✖</button>
            <h2>🧠 {selectedRecord.topic || "제목 없음"}</h2>
            <p><strong>날짜:</strong> {selectedRecord.date}</p>
            <p><strong>문제 유형:</strong> {selectedRecord.problemType?.join(", ")}</p>
            <p><strong>목표:</strong> {selectedRecord.goal}</p>
            <p><strong>전략:</strong> {selectedRecord.strategy}</p>
            <p><strong>근거:</strong> {selectedRecord.sources}</p>
            <p><strong>분석:</strong> {selectedRecord.analysis}</p>
            <p><strong>협력:</strong> {selectedRecord.collaboration}</p>
            <p><strong>통찰:</strong> {selectedRecord.reflection}</p>
            <p><strong>어려움:</strong> {selectedRecord.difficulty}</p>
            <p><strong>감정:</strong> {selectedRecord.emotion}</p>
            <p><strong>장기적 성찰:</strong> {selectedRecord.longTermMeaning}</p>
            <p><strong>실행 계획:</strong> {selectedRecord.todo}</p>
            <p><strong>기한:</strong> {selectedRecord.deadline}</p>

            {/* 🔹 AI 피드백 표시 (thinkingFeedbackLogs 연결 시) */}
            {selectedRecord.aiFeedback && (
              <>
                <h3>🤖 AI 피드백</h3>
                <pre className="ai-feedback-box">{selectedRecord.aiFeedback}</pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
