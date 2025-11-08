// /api/getThinkingFeedback.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const formData = req.body;

    const {
      date,
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
    각 항목을 종합해, 사고 과정과 성장 가능성을 분석해 주세요.

    [기본 정보]
    - 날짜: ${date || "날짜 미입력"}
    - 주제: ${topic}
    - 목표: ${goal}
    - 선행 지식: ${priorKnowledge}
    - 전략 및 활동: ${strategy}
    - 근거 및 출처: ${sources}
    - 분석 및 대안 탐색: ${analysis}
    - 협력 활동: ${collaboration}
    - 평가(1~5): ${evaluation}
    - 반성 및 통찰: ${reflection}
    - 어려움과 개선 방안: ${difficulty}
    - 감정 상태: ${emotion}
    - 장기적 의미: ${longTermMeaning}
    - 실행 계획: ${todo}
    - 기한: ${deadline}
    - 자료: ${resources}
    - 비판적 사고 체크리스트: ${JSON.stringify(criticalThinking, null, 2)}

    [요청]
    위 내용을 바탕으로 학생의 사고력을 코치하듯 피드백을 작성해주세요.
    다음 항목을 포함해 자연스러운 문단으로 써 주세요:
    - 전체적인 요약
    - 강점과 발전점
    - 개선 제안
    - 격려나 조언 한마디
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = completion.choices[0].message.content;

    res.status(200).json({ feedback });
  } catch (error) {
    console.error("❌ OpenAI 서버 오류:", error);
    res.status(500).json({ error: error.message });
  }
}
