import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getThinkingFeedback } from "../openai";
import "./ThinkingForm.css";

export default function ThinkingForm({ user, onFeedback }) {
  // === 상태 정의 ===
  const [form, setForm] = useState({
    date: "",
    topic: "",
    goal: "",
    strategy: "",
    analysis: "",
    reflection: "",
    evaluation: "",
    difficulty: "",
    todo: "",
    deadline: "",
    resources: "",
  });

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [problemType, setProblemType] = useState([]);

  const [loading, setLoading] = useState(false);

  // === 입력 핸들러 ===
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // === 체크박스 토글 ===
  const toggleSelect = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // === 제출 ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic || !form.goal) {
      alert("주제와 목표를 입력해주세요 ✏️");
      return;
    }

    setLoading(true);

    const fullData = {
      ...form,
      userId: user.id,
      email: user.email,
      category,
      subCategory,
      problemType,
    };

    try {
      // 1️⃣ AI 피드백 생성
      const aiResult = await getThinkingFeedback(fullData);

      // 2️⃣ Firestore 저장
      await addDoc(collection(db, "thinkingRecords"), {
        ...fullData,
        createdAt: serverTimestamp(),
        aiFeedback: aiResult,
        logicScore: aiResult.logicScore || 0,
        criticalScore: aiResult.criticalScore || 0,
        improvementScore: aiResult.improvementScore || 0,
      });

      // 3️⃣ 상위 컴포넌트에 전달 (자동 전환)
      onFeedback(aiResult);
      alert("기록이 저장되었습니다! ✅");
      setForm({
        date: "",
        topic: "",
        goal: "",
        strategy: "",
        analysis: "",
        reflection: "",
        evaluation: "",
        difficulty: "",
        todo: "",
        deadline: "",
        resources: "",
      });
      setCategory("");
      setSubCategory([]);
      setProblemType([]);
    } catch (error) {
      console.error("저장 오류:", error);
      alert("기록 저장 중 오류가 발생했습니다 ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="thinking-form" onSubmit={handleSubmit}>
      <h2>🧠 사고 훈련 기록지</h2>

      {/* === 날짜 / 주제 === */}
      <div className="form-row">
        <label>📅 날짜</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>🎯 주제</label>
        <input
          type="text"
          name="topic"
          value={form.topic}
          onChange={handleChange}
          placeholder="오늘 사고 훈련의 주제를 적어주세요"
        />
      </div>

      {/* === 1️⃣ 문학 / 비문학 === */}
      <div className="form-section">
        <h3>1️⃣ 문제 영역 선택</h3>
        <div className="choice-grid">
          {["문학", "비문학"].map((type) => (
            <button
              key={type}
              type="button"
              className={`choice-btn ${category === type ? "selected" : ""}`}
              onClick={() => setCategory(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* === 2️⃣ 이해 / 시간 / 적용 === */}
      <div className="form-section">
        <h3>2️⃣ 사고 초점 선택</h3>
        <div className="choice-grid">
          {["이해", "시간", "적용"].map((type) => (
            <button
              key={type}
              type="button"
              className={`choice-btn ${
                subCategory.includes(type) ? "selected" : ""
              }`}
              onClick={() => toggleSelect(subCategory, setSubCategory, type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* === 3️⃣ 세부 문제 유형 === */}
      <div className="form-section">
        <h3>3️⃣ 세부 문제 유형</h3>
        <div className="choice-grid">
          {[
            "정확성", "시간", "지문", "문제", "연습", "연구"
          ].map((type) => (
            <button
              key={type}
              type="button"
              className={`choice-btn ${
                problemType.includes(type) ? "selected" : ""
              }`}
              onClick={() => toggleSelect(problemType, setProblemType, type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* === 사고 내용 === */}
      <div className="form-row">
        <label>🎯 목표</label>
        <textarea
          name="goal"
          value={form.goal}
          onChange={handleChange}
          placeholder="이번 사고 훈련의 목표를 구체적으로 작성하세요"
        />
      </div>

      <div className="form-row">
        <label>🧩 전략 및 활동</label>
        <textarea
          name="strategy"
          value={form.strategy}
          onChange={handleChange}
          placeholder="문제를 해결하기 위해 어떤 전략을 사용했나요?"
        />
      </div>

      <div className="form-row">
        <label>🔍 분석 / 탐구</label>
        <textarea
          name="analysis"
          value={form.analysis}
          onChange={handleChange}
          placeholder="활동 중 어떤 통찰을 얻었나요?"
        />
      </div>

      <div className="form-row">
        <label>💭 성찰 / 느낀점</label>
        <textarea
          name="reflection"
          value={form.reflection}
          onChange={handleChange}
          placeholder="이 과정을 통해 무엇을 배웠나요?"
        />
      </div>

      <div className="form-row">
        <label>📊 자기평가 (1~5)</label>
        <input
          type="number"
          name="evaluation"
          min="1"
          max="5"
          value={form.evaluation}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>⚙️ 어려움</label>
        <textarea
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          placeholder="가장 어려웠던 점은 무엇인가요?"
        />
      </div>

      <div className="form-row">
        <label>🚀 다음 할 일</label>
        <input
          type="text"
          name="todo"
          value={form.todo}
          onChange={handleChange}
          placeholder="다음 단계로 무엇을 할 계획인가요?"
        />
      </div>

      <div className="form-row">
        <label>⏰ 기한</label>
        <input
          type="text"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          placeholder="예: 11/20"
        />
      </div>

      <div className="form-row">
        <label>📚 활용 자료</label>
        <input
          type="text"
          name="resources"
          value={form.resources}
          onChange={handleChange}
          placeholder="참고한 자료나 출처를 입력하세요"
        />
      </div>

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "AI 분석 중..." : "기록 저장 & AI 피드백 받기 🚀"}
      </button>
    </form>
  );
}
