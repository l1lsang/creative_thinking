import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { getThinkingFeedback } from "../openai.js";
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

  // ✅ 문제 유형 토글
  const toggleProblemType = (type) => {
    setForm((prev) => {
      const selected = prev.problemType.includes(type)
        ? prev.problemType.filter((t) => t !== type)
        : [...prev.problemType, type];
      return { ...prev, problemType: selected };
    });
  };

  // ✅ 비판적 사고 체크박스 토글
  const toggleCriticalThinking = (key) => {
    setForm((prev) => ({
      ...prev,
      criticalThinking: {
        ...prev.criticalThinking,
        [key]: !prev.criticalThinking[key],
      },
    }));
  };

  // ✅ 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🧩 [Debug] user 객체:", user);
    console.log("🧩 [Debug] 제출 데이터:", form);

    if (!user || !user.id) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요 ⚠️");
      setLoading(false);
      return;
    }

    try {
      // ✅ Firestore에 저장
      const docRef = await addDoc(collection(db, "thinkingRecords"), {
        userId: user.id,
        email: user.email || "",
        ...form,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Firestore 저장 성공! 문서 ID:", docRef.id);

      // ✅ OpenAI 피드백 생성
      try {
        const feedback = await getThinkingFeedback(form);

        // Firestore에 aiFeedback 필드 업데이트
        await addDoc(collection(db, "thinkingFeedbackLogs"), {
          userId: user.id,
          recordId: docRef.id,
          feedback,
          createdAt: serverTimestamp(),
        });

        onFeedback(feedback);
        console.log("🤖 AI 피드백 생성 성공:", feedback);
      } catch (aiError) {
        console.error("🤖 AI 피드백 오류:", aiError);
        alert("기록은 저장되었지만 AI 피드백 생성 중 오류가 발생했습니다 ⚠️");
      }

      alert("기록이 성공적으로 저장되었습니다 🧠✨");
    } catch (err) {
      console.error("🔥 Firestore 에러 상세:", err);
      alert("저장 중 오류가 발생했습니다 ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="thinking-form">
      {/* --- 사고 트레이닝 안내 --- */}
      <section className="thinking-guide">
        <h2 className="thinking-guide-title">🧭 사고 트레이닝 기록지 안내</h2>
        <p>
          이 기록지는 여러분이 자유롭게 사고하고 토론하며 스스로 성장할 수 있도록 돕는 학습 도구입니다. 
          다음의 연구 결과는 왜 이런 기록이 중요한지를 보여줍니다.
        </p>
        <ul>
          <li>자기조절학습(Self-Regulated Learning)은 목표 설정, 전략 수립, 반성(reflection)과 같은 과정을 통해 학습을 스스로 조절한다고 설명합니다.</li>
          <li>반성적 저널과 일기 쓰기는 경험을 정리하고 통찰을 얻도록 돕습니다.</li>
          <li>비판적 사고 루브릭은 문제 정의 → 근거 탐색 → 분석 → 반대 검토 → 결론 도출의 과정을 강조합니다.</li>
        </ul>
      </section>

      {/* --- A. 기본 정보 --- */}
      <section className="thinking-section">
        <h2 className="thinking-title">A. 기본 정보</h2>
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
          문제 유형:
          {["정확성", "시간", "지문", "문제", "연습", "연구"].map((t) => (
            <label key={t} className="thinking-checkbox-item">
              <input
                type="checkbox"
                checked={form.problemType.includes(t)}
                onChange={() => toggleProblemType(t)}
                className="thinking-checkbox"
              />
              <span>{t}</span>
            </label>
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
          onChange={(e) => setForm({ ...form, priorKnowledge: e.target.value })}
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
          onChange={(e) => setForm({ ...form, collaboration: e.target.value })}
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
      <button type="submit" disabled={loading} className="thinking-submit-btn">
        {loading ? "저장 중..." : "저장 및 피드백 받기"}
      </button>
    </form>
  );
}
