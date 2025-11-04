// src/openai.js
export async function getThinkingFeedback(formData) {
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
              "너는 사고력 코치야. 학생의 사고 과정을 분석하고, 논리적 사고력과 비판적 사고력에 대해 따뜻하고 구체적인 피드백을 제공해줘.",
          },
          {
            role: "user",
            content: `
학생의 사고 기록:

날짜: ${formData.date}
주제: ${formData.topic}
문제 유형: ${formData.problemType.join(", ")}

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
${Object.entries(formData.criticalThinking)
  .map(([k, v]) => `${k}: ${v ? "예" : "아니오"}`)
  .join(", ")}
`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "피드백 생성 실패 😢";
  } catch (error) {
    console.error("OpenAI 요청 오류:", error);
    return "피드백 요청 중 오류가 발생했습니다 ❌";
  }
}
// ✅ 관리자 요약 함수
export async function getAdminSummary(records) {
  try {
    // records 배열에서 핵심만 추려서 프롬프트로 전달
    const summaryText = records
      .map((r, i) => `(${i + 1}) ${r.topic || "제목 없음"} - 목표: ${r.goal || "-"}, 통찰: ${r.reflection || "-"}`)
      .slice(0, 20) // 너무 많을 경우 20개까지만 요약
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
            content: "너는 교육 연구용 데이터 분석가이자 사고력 코치야. 학생들의 사고 훈련 기록을 종합해서 주요 패턴, 강점, 개선점, 다음 목표를 요약해줘.",
          },
          {
            role: "user",
            content: `
다음은 학생들의 사고 기록 샘플이야:
${summaryText}

이 데이터를 분석해서 아래 항목으로 요약해줘.
1️⃣ 주요 경향
2️⃣ 공통 강점
3️⃣ 자주 드러나는 어려움
4️⃣ 다음 단계 제안
            `,
          },
        ],
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "AI 요약 생성 실패 😢";
  } catch (error) {
    console.error("AI 요약 오류:", error);
    return "요약 중 오류 발생 ❌";
  }
}
