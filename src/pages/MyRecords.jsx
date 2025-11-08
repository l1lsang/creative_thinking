import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
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

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="records-container">
      <h2>📚 나의 사고 기록 ({records.length})</h2>
      <div className="records-grid">
        {records.map((r) => (
          <div
            key={r.id}
            className="record-card"
            onClick={() => setSelected(r)}
          >
            <h4>{r.topic}</h4>
            <p>{r.date}</p>
            <p>{r.category} / {r.subCategory?.join(", ")}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setSelected(null)}>닫기 ✖</button>
            <h3>{selected.topic}</h3>
            <p><b>문제영역:</b> {selected.category}</p>
            <p><b>초점:</b> {selected.subCategory?.join(", ")}</p>
            <p><b>유형:</b> {selected.problemType?.join(", ")}</p>
            <p><b>목표:</b> {selected.goal}</p>
            <p><b>전략:</b> {selected.strategy}</p>
            <p><b>성찰:</b> {selected.reflection}</p>
            <p><b>어려움:</b> {selected.difficulty}</p>
            {selected.aiFeedback && (
              <>
                <h4>🤖 AI 피드백</h4>
                <pre>{JSON.stringify(selected.aiFeedback, null, 2)}</pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
