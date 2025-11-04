import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { getThinkingFeedback } from "../openai";
import "./ThinkingForm.css";

export default function ThinkingForm({ user, onFeedback }) {
  const [form, setForm] = useState({
    date: "",
    topic: "",
    problemType: [],
    goal: "",
    priorKnowledge: "",
    strategy: "",
    sources: "",
    analysis: "",
    collaboration: "",
    evaluation: "",
    reflection: "",
    difficulty: "",
    criticalThinking: {
      defineProblem: false,
      findEvidence: false,
      analyzeIdeas: false,
      checkCounter: false,
      acknowledgeBias: false,
      drawConclusion: false,
    },
    emotion: "",
    longTermMeaning: "",
    todo: "",
    deadline: "",
    resources: "",
  });

  const [loading, setLoading] = useState(false);

  const toggleProblemType = (type) => {
    setForm((prev) => {
      const selected = prev.problemType.includes(type)
        ? prev.problemType.filter((t) => t !== type)
        : [...prev.problemType, type];
      return { ...prev, problemType: selected };
    });
  };

  const toggleCriticalThinking = (key) => {
    setForm((prev) => ({
      ...prev,
      criticalThinking: {
        ...prev.criticalThinking,
        [key]: !prev.criticalThinking[key],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "thinkingRecords"), {
        userId: user.uid,
        email: user.email,
        ...form,
        createdAt: serverTimestamp(),
      });

      const feedback = await getThinkingFeedback(form);
      onFeedback(feedback);

      alert("기록이 성공적으로 저장되었습니다 🧠✨");
    } catch (err) {
      console.error("저장 오류:", err);
      alert("저장 중 오류가 발생했습니다 ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="thinking-form">
      {/* --- A. 기본 정보 --- */}
      <section className="thinking-section">
        <h2>A. 기본 정보</h2>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="thinking-input"
        />
        <input
          type="text"
          placeholder="수업/토론 주제"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="thinking-input"
        />
        <div className="thinking-checkbox-group">
          <span>문제 유형:</span>
          {["정확성", "시간", "지문", "문제", "연습", "연구"].map((t) => (
            <label key={t}>
              <input
                type="checkbox"
                className="thinking-checkbox"
                checked={form.problemType.includes(t)}
                onChange={() => toggleProblemType(t)}
              />{" "}
              {t}
            </label>
          ))}
        </div>
      </section>

      {/* --- B. 사전 사고 --- */}
      <section className="thinking-section">
        <h2>B. 사전 사고</h2>
        <textarea
          placeholder="목표 설정: 이번 활동에서 무엇을 달성하고 싶은가?"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          className="thinking-textarea"
        />
        <textarea
          placeholder="선행 지식·가정: 주제에 대해 알고 있는 내용과 예상되는 어려움은?"
          value={form.priorKnowledge}
          onChange={(e) => setForm({ ...form, priorKnowledge: e.target.value })}
          className="thinking-textarea"
        />
      </section>

      {/* --- C. 사고 과정 --- */}
      <section className="thinking-section">
        <h2>C. 사고 과정</h2>
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
          onChange={(e) => setForm({ ...form, collaboration: e.target.value })}
          className="thinking-textarea"
        />
      </section>

      {/* --- D. 사고 후 반성 --- */}
      <section className="thinking-section">
        <h2>D. 사고 후 반성</h2>
        <div className="thinking-radio-group">
          <span>성과 평가:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input
                type="radio"
                className="thinking-radio"
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
        {Object.entries(form.criticalThinking).map(([key, value]) => (
          <label key={key} className="thinking-checkbox-item">
            <input
              type="checkbox"
              className="thinking-checkbox"
              checked={value}
              onChange={() => toggleCriticalThinking(key)}
            />{" "}
            {key}
          </label>
        ))}

        <textarea
          placeholder="감정과 동기 상태"
          value={form.emotion}
          onChange={(e) => setForm({ ...form, emotion: e.target.value })}
          className="thinking-textarea"
        />
      </section>

      {/* --- E. 장기적 성찰 --- */}
      <section className="thinking-section">
        <h2>E. 장기적 성찰</h2>
        <textarea
          placeholder="이번 활동이 나의 장기적 목표나 삶에 어떤 의미를 주는지"
          value={form.longTermMeaning}
          onChange={(e) =>
            setForm({ ...form, longTermMeaning: e.target.value })
          }
          className="thinking-textarea"
        />
      </section>

      {/* --- F. 실행 계획 점검 --- */}
      <section className="thinking-section">
        <h2>F. 실행 계획 점검</h2>
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
      <button
        type="submit"
        disabled={loading}
        className="thinking-submit"
      >
        {loading ? "저장 중..." : "저장 및 피드백 받기"}
      </button>

      {/* --- 안내문 섹션 --- */}
      <section className="thinking-guide">
        <h2>🧭 사고 트레이닝 기록지 안내</h2>
        <p>
          이 기록지는 여러분이 자유롭게 사고하고 토론하며 스스로 성장할 수 있도록 돕는 학습 도구입니다. 교육의 궁극적 목표는 여러분이 가치 있고 행복한 삶을 살아가는 것입니다.
        </p>
        <ul>
          <li>자기조절학습(Self-Regulated Learning)은 목표 설정, 전략 수립, 자기효능감, 도움 요청, 반성(reflection) 등의 과정을 통해 학습을 조절한다고 봅니다.</li>
          <li>메타인지 프롬프트(‘이 목표를 어떻게 달성할 것인가?’ 등)는 자기조절학습 능력과 성과를 높입니다.</li>
          <li>반성적 저널과 일기 쓰기는 감정을 표현하고 경험에서 통찰을 얻는 데 도움을 줍니다.</li>
          <li>비판적 사고 루브릭은 문제 정의, 근거 찾기, 반대 증거 검토, 결론 도출을 강조합니다.</li>
        </ul>
        <p className="guide-subtitle">기록지 활용 방법</p>
        <ol>
          <li>사전 사고: 목표를 설정하고 선행 지식을 정리합니다.</li>
          <li>사고 과정: 전략, 자료, 분석, 협력을 기록합니다.</li>
          <li>사고 후 반성: 성과를 평가하고 개선점을 찾습니다.</li>
          <li>장기적 성찰: 학습이 삶과 어떻게 연결되는지 성찰합니다.</li>
          <li>실행 계획 점검: 해야 할 일, 기한, 자료를 구체화합니다.</li>
        </ol>
        <p className="guide-subtitle">수집된 자료의 활용</p>
        <ul>
          <li>기록은 사고력 코칭 알고리즘 개발에 활용됩니다.</li>
          <li>데이터는 익명화되어 교육 목적 외에는 사용되지 않습니다.</li>
        </ul>
      </section>
    </form>
  );
}
