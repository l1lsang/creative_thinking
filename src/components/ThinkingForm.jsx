import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getThinkingFeedback } from "../openai";
import "./ThinkingForm.css";

export default function ThinkingForm({ user, onFeedback }) {
  const [loading, setLoading] = useState(false);

  // ✅ 폼 상태
  const [form, setForm] = useState({
    date: "",
    topic: "",
    goal: "",
    priorKnowledge: "",
    strategy: "",
    sources: "",
    analysis: "",
    collaboration: "",
    evaluation: "",
    reflection: "",
    difficulty: "",
    emotion: "",
    longTermMeaning: "",
    todo: "",
    deadline: "",
    resources: "",
    criticalThinking: {
      defineProblem: false,
      findEvidence: false,
      analyzeIdeas: false,
      checkCounter: false,
      acknowledgeBias: false,
      drawConclusion: false,
    },
  });

  // ✅ 문제 영역 관련 상태
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [problemType, setProblemType] = useState([]);

  // ✅ 토글 함수 (중복 선택 가능)
  const toggleSelect = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // ✅ 비판적 사고 토글
  const toggleCriticalThinking = (key) => {
    setForm((prev) => ({
      ...prev,
      criticalThinking: {
        ...prev.criticalThinking,
        [key]: !prev.criticalThinking[key],
      },
    }));
  };

  // ✅ 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic || !form.goal || !form.date) {
      alert("날짜, 주제, 목표를 모두 입력해주세요 ✏️");
      return;
    }

    setLoading(true);

    try {
      const fullData = {
        ...form,
        userId: user.id,
        email: user.email,
        category,
        subCategory,
        problemType,
      };

      // 1️⃣ AI 피드백 생성
      const aiResult = await getThinkingFeedback(fullData);

      // 2️⃣ Firestore 저장
      await addDoc(collection(db, "thinkingRecords"), {
        ...fullData,
        createdAt: serverTimestamp(),
        aiFeedback: aiResult,
      });

      // 3️⃣ 상위로 전달
      onFeedback(aiResult, fullData);
      alert("기록이 성공적으로 저장되었습니다 ✅");

      // 4️⃣ 폼 초기화
      setForm({
        date: "",
        topic: "",
        goal: "",
        priorKnowledge: "",
        strategy: "",
        sources: "",
        analysis: "",
        collaboration: "",
        evaluation: "",
        reflection: "",
        difficulty: "",
        emotion: "",
        longTermMeaning: "",
        todo: "",
        deadline: "",
        resources: "",
        criticalThinking: {
          defineProblem: false,
          findEvidence: false,
          analyzeIdeas: false,
          checkCounter: false,
          acknowledgeBias: false,
          drawConclusion: false,
        },
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
      <h1 className="thinking-title-main">🧠 사고 훈련 기록지</h1>

      {/* --- 기본 정보 입력 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">🗓️ 기본 정보 입력</h2>

        <div className="thinking-input-group">
          <label>
            날짜:
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="thinking-input"
              required
            />
          </label>
        </div>

        <div className="thinking-input-group">
          <label>
            수업/토론 주제:
            <input
              type="text"
              placeholder="예: 환경 보호 토론, 문학 속 인물 분석 등"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="thinking-input"
              required
            />
          </label>
        </div>
      </section>

      {/* --- A. 문제 영역 선택 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">A. 문제 영역 선택</h2>

        {/* 1️⃣ 문제 영역 */}
        <h3 className="thinking-subtitle">1️⃣ 문제 영역</h3>
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

        {/* 2️⃣ 사고 초점 */}
        <h3 className="thinking-subtitle">2️⃣ 사고 초점</h3>
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

        {/* 3️⃣ 세부 문제 유형 */}
        <h3 className="thinking-subtitle">3️⃣ 세부 문제 유형</h3>
        <div className="choice-grid">
          {["정확성", "시간", "지문", "문제", "연습", "연구"].map((type) => (
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
      </section>

      {/* --- B. 사전 사고 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">B. 사전 사고</h2>
        <textarea
          placeholder="목표 설정: 이번 활동에서 무엇을 달성하고 싶은가?"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          className="thinking-textarea"
        />
        <textarea
          placeholder="선행 지식·가정: 주제에 대해 알고 있는 내용과 예상되는 어려움은?"
          value={form.priorKnowledge}
          onChange={(e) =>
            setForm({ ...form, priorKnowledge: e.target.value })
          }
          className="thinking-textarea"
        />
      </section>

      {/* --- C. 사고 과정 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">C. 사고 과정</h2>
        <textarea
          placeholder="전략 및 활동"
          value={form.strategy}
          onChange={(e) => setForm({ ...form, strategy: e.target.value })}
          className="thinking-textarea"
        />
        <textarea
          placeholder="근거·출처"
          value={form.sources}
          onChange={(e) => setForm({ ...form, sources: e.target.value })}
          className="thinking-textarea"
        />
        <textarea
          placeholder="정보 분석 및 대안 탐색"
          value={form.analysis}
          onChange={(e) => setForm({ ...form, analysis: e.target.value })}
          className="thinking-textarea"
        />
        <textarea
          placeholder="도움 요청 및 협력"
          value={form.collaboration}
          onChange={(e) =>
            setForm({ ...form, collaboration: e.target.value })
          }
          className="thinking-textarea"
        />
      </section>

      {/* --- D. 사고 후 반성 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">D. 사고 후 반성</h2>
        <div className="thinking-radio-group">
          성과 평가:{" "}
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input
                type="radio"
                name="evaluation"
                checked={form.evaluation === String(n)}
                onChange={() => setForm({ ...form, evaluation: String(n) })}
              />{" "}
              {n}
            </label>
          ))}
        </div>

        <textarea
          placeholder="새로 알게 된 점/통찰"
          value={form.reflection}
          onChange={(e) => setForm({ ...form, reflection: e.target.value })}
          className="thinking-textarea"
        />
        <textarea
          placeholder="어려움과 개선 방안"
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="thinking-textarea"
        />

        <h3 className="thinking-subtitle">비판적 사고 요소 체크</h3>
        <div className="thinking-checkbox-group">
          {Object.entries(form.criticalThinking).map(([key, value]) => {
            const labels = {
              defineProblem: "문제를 명확히 정의했는가?",
              findEvidence: "근거 출처를 찾았는가?",
              analyzeIdeas: "아이디어를 분석했는가?",
              checkCounter: "반대 증거를 검토했는가?",
              acknowledgeBias: "편견이나 가정을 인정했는가?",
              drawConclusion: "결론을 도출했는가?",
            };

            return (
              <label key={key} className="thinking-checkbox-item">
                <input
                  type="checkbox"
                  className="thinking-checkbox"
                  checked={value}
                  onChange={() => toggleCriticalThinking(key)}
                />
                <span>{labels[key]}</span>
              </label>
            );
          })}
        </div>

        <textarea
          placeholder="감정과 동기 상태"
          value={form.emotion}
          onChange={(e) => setForm({ ...form, emotion: e.target.value })}
          className="thinking-textarea"
        />
      </section>

      {/* --- E. 장기적 성찰 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">E. 장기적 성찰</h2>
        <textarea
          placeholder="이번 활동이 나의 장기적 목표나 삶에 어떤 의미를 주는지"
          value={form.longTermMeaning}
          onChange={(e) =>
            setForm({ ...form, longTermMeaning: e.target.value })
          }
          className="thinking-textarea"
        />
      </section>

      {/* --- F. 실행 계획 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">F. 실행 계획 점검</h2>
        <textarea
          placeholder="해야 할 일"
          value={form.todo}
          onChange={(e) => setForm({ ...form, todo: e.target.value })}
          className="thinking-textarea"
        />
        <input
          type="text"
          placeholder="기한 (예: 2025-11-10)"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="thinking-input"
        />
        <textarea
          placeholder="활용 자료"
          value={form.resources}
          onChange={(e) => setForm({ ...form, resources: e.target.value })}
          className="thinking-textarea"
        />
      </section>

      {/* --- 제출 버튼 --- */}
      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "AI 분석 중..." : "기록 저장 & AI 피드백 받기 🚀"}
      </button>
    </form>
  );
}
