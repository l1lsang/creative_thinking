import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, "thinkingRecords"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setRecords(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>🧾 관리자 대시보드</h2>
      <p>총 {records.length}개의 기록</p>
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>학생</th>
            <th>주제</th>
            <th>문제영역</th>
            <th>AI요약</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.email}</td>
              <td>{r.topic}</td>
              <td>{r.category}</td>
              <td>{r.aiFeedback?.meta?.요약 || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
