import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ 환경 변수로 읽기
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const formData = req.body;

    const prompt = `
다음은 학생의 사고 훈련 기록입니다.

주제: ${formData.topic}
목표: ${formData.goal}
사전 지식: ${formData.priorKnowledge}
전략 및 활동: ${formData.strategy}
근거 및 출처: ${formData.sources}
분석: ${formData.analysis}
협력: ${formData.collaboration}
평가: ${formData.evaluation}
반성: ${formData.reflection}
감정: ${formData.emotion}
장기적 의미: ${formData.longTermMeaning}
실행 계획: ${formData.todo}
기한: ${formData.deadline}
자료: ${formData.resources}

너는 사고력 코치야.
학생의 답변을 분석해서 문장 형태로 피드백을 줘.
다음 기준을 참고해줘:
- 목표의 구체성
- 사고의 논리성
- 반성과 개선 의식
- 감정과 태도의 자기 인식
- 장기적 성장 방향 제안

응답은 **문장 그대로**, JSON 아님.
사람에게 이야기하듯 자연스럽게 피드백해줘.
`;

    // ✅ 응답을 “텍스트 그대로” 받기
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = completion.choices[0].message.content;

    res.status(200).json({ feedback }); // ✅ JSON 안에 텍스트만 넣음
  } catch (error) {
    console.error("❌ OpenAI 서버 오류:", error);
    res.status(500).json({ error: "서버 내부 오류", details: error.message });
  }
}
