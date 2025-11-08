import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function getThinkingFeedback(formData) {
  const {
    topic,
    goal,
    priorKnowledge,
    strategy,
    sources,
    analysis,
    collaboration,
    evaluation,
    reflection,
    difficulty,
    emotion,
    longTermMeaning,
    todo,
    deadline,
    resources,
    criticalThinking,
  } = formData;

  const prompt = `
  아래는 학생의 사고 훈련 기록입니다.

  [기본 정보]
  - 주제: ${topic}
  - 목표: ${goal}
  - 선행 지식: ${priorKnowledge}
  - 전략 및 활동: ${strategy}
  - 근거 및 출처: ${sources}
  - 정보 분석 및 대안 탐색: ${analysis}
  - 협력 활동: ${collaboration}
  - 평가(1~5): ${evaluation}
  - 반성 및 통찰: ${reflection}
  - 어려움/개선 방안: ${difficulty}
  - 감정 상태: ${emotion}
  - 장기적 의미: ${longTermMeaning}
  - 실행 계획: ${todo}
  - 기한: ${deadline}
  - 자료: ${resources}
  - 비판적 사고 체크리스트: ${JSON.stringify(criticalThinking, null, 2)}

  [AI의 역할]
  너는 사고력 코치야. 위의 데이터를 분석해서 다음 기준으로 구체적인 피드백을 줘.

  1. 목표의 구체성 및 도전성
  2. 전략과 근거의 논리성
  3. 분석 및 협력 과정의 깊이
  4. 반성 및 개선 의식
  5. 비판적 사고 요소의 실천 정도
  6. 감정 및 태도에 대한 자기 인식
  7. 장기적 의미와 실행 계획의 연결성

  [출력 형식]
  아래 형식의 JSON으로 작성해줘.
  {
    "summary": "학생의 사고 과정을 요약",
    "strengths": ["강점 1", "강점 2"],
    "weaknesses": ["보완점 1", "보완점 2"],
    "suggestions": ["개선 제안 1", "개선 제안 2"],
    "growthDirection": "장기적 성장 방향 제안"
  }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}
