// src/pages/RecordDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import "./RecordDetail.css";

export default function RecordDetail() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      const docRef = doc(db, "thinkingRecords", recordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecord(docSnap.data());
      } else {
        console.log("❌ Document not found");
      }
      setLoading(false);
    };
    fetchRecord();
  }, [recordId]);

  if (loading) return <p className="record-loading">로딩 중...</p>;
  if (!record) return <p>기록을 찾을 수 없습니다.</p>;

  return (
    <div className="record-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">← 목록으로</button>
      <h1 className="record-title">{record.topic || "제목 없음"}</h1>
      <p className="record-author"><strong>작성자:</strong> {record.email || record.userId}</p>
      <p className="record-date"><strong>작성일:</strong> {new Date(record.createdAt.seconds * 1000).toLocaleString()}</p>

      <section className="record-section">
        <h2>🎯 목표</h2>
        <p>{record.goal || "작성된 목표가 없습니다."}</p>
      </section>

      <section className="record-section">
        <h2>💭 사고 과정</h2>
        <p>{record.thinkingProcess || "내용 없음"}</p>
      </section>

      <section className="record-section">
        <h2>🔍 반성 및 성찰</h2>
        <p>{record.reflection || "내용 없음"}</p>
      </section>

      <section className="record-section">
        <h2>🧠 AI 피드백</h2>
        <div className="ai-feedback-box">
          {record.aiFeedback ? (
            <pre>{record.aiFeedback}</pre>
          ) : (
            <p>아직 피드백이 생성되지 않았습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
