// src/openai.js

// 🧠 사고력 피드백 생성 함수
export async function getThinkingFeedback(formData) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.error("❌ OpenAI API 키가 설정되어 있지 않습니다 (.env 확인 필요)");
    return "⚠️ OpenAI API 키가 누락되었습니다. 관리자에게 문의하세요.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 사고력 코치야. 학생의 사고 과정을 분석하고, 논리적 사고력과 비판적 사고력에 대해 따뜻하고 구체적인 피드백을 제공해줘. 문체는 부드럽지만 구체적으로, 개선 방향도 제시해줘.",
          },
          {
            role: "user",
            content: `
학생의 사고 기록입니다. 이 내용을 분석하고 논리적·비판적 사고 측면에서 구체적인 피드백을 작성해주세요.

날짜: ${formData.date}
주제: ${formData.topic}
문제 유형: ${formData.problemType?.join(", ") || "없음"}

목표: ${formData.goal}
선행 지식: ${formData.priorKnowledge}
전략: ${formData.strategy}
근거: ${formData.sources}
분석: ${formData.analysis}
협력: ${formData.collaboration}

성과 평가: ${formData.evaluation}
통찰: ${formData.reflection}
어려움: ${formData.difficulty}
감정 상태: ${formData.emotion}

장기적 성찰: ${formData.longTermMeaning}
실행 계획: ${formData.todo}
기한: ${formData.deadline}
참고 자료: ${formData.resources}

비판적 사고 체크:
${Object.entries(formData.criticalThinking || {})
  .map(([k, v]) => `${k}: ${v ? "예" : "아니오"}`)
  .join(", ")}
`,
          },
        ],
        temperature: 0.75,
        max_tokens: 700,
      }),
    });

    const data = await response.json();

    // ✅ 응답 검증
    if (!response.ok) {
      console.error("OpenAI 응답 오류:", data);
      return `⚠️ 피드백 요청 실패: ${data.error?.message || "알 수 없는 오류"}`;
    }

    const feedback = data.choices?.[0]?.message?.content?.trim();
    if (!feedback) return "⚠️ AI 피드백 생성 실패 😢";

    return feedback;
  } catch (error) {
    console.error("🚨 OpenAI 요청 오류:", error);
    return "⚠️ 피드백 요청 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.";
  }
}

// 🧩 관리자용 요약 함수
export async function getAdminSummary(records) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.error("❌ OpenAI API 키가 설정되어 있지 않습니다 (.env 확인 필요)");
    return "⚠️ OpenAI API 키가 누락되었습니다. 관리자에게 문의하세요.";
  }

  try {
    // records에서 핵심만 추출
    const summaryText = records
      .map(
        (r, i) =>
          `(${i + 1}) ${r.topic || "제목 없음"} | 목표: ${r.goal || "-"} | 통찰: ${
            r.reflection || "-"
          } | 평가: ${r.evaluation || "-"}`
      )
      .slice(0, 20)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 교육 데이터 분석가이자 사고력 코치야. 학생들의 사고 훈련 데이터를 요약해서 주요 패턴, 강점, 개선점을 간결하게 제시해줘.",
          },
          {
            role: "user",
            content: `
다음은 여러 학생들의 사고력 기록이야:

${summaryText}

이 데이터를 바탕으로 아래 형식으로 요약해줘.
1️⃣ 주요 경향  
2️⃣ 공통 강점  
3️⃣ 자주 드러나는 어려움  
4️⃣ 다음 단계 제안  
            `,
          },
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("AI 요약 오류:", data);
      return `⚠️ AI 요약 실패: ${data.error?.message || "서버 응답 오류"}`;
    }

    const summary = data.choices?.[0]?.message?.content?.trim();
    if (!summary) return "⚠️ AI 요약 생성 실패 😢";

    return summary;
  } catch (error) {
    console.error("🚨 AI 요약 요청 오류:", error);
    return "⚠️ 요약 요청 중 오류가 발생했습니다 ❌";
  }
}
