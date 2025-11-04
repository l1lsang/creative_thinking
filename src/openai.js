// src/openai.js
export async function getFeedbackFromAI(answer) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ OpenAI API key가 설정되어 있지 않습니다. (.env 확인)");
    return "⚠️ 시스템 오류: OpenAI API Key가 없습니다. 관리자에게 문의하세요.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 사고력 코치야. 학생의 사고 답변을 분석하고 논리적 사고력, 비판적 사고력, 창의적 사고력을 구조적으로 피드백해줘. 결과는 1️⃣ 논리적 강점, 2️⃣ 비판적 사고 포인트, 3️⃣ 개선 방향 세 부분으로 나눠서 알려줘.",
          },
          {
            role: "user",
            content: `학생의 사고 답변:\n${answer}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API 오류: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const feedback = data?.choices?.[0]?.message?.content || "피드백을 불러오지 못했습니다.";
    return feedback;
  } catch (err) {
    console.error("🚨 OpenAI 요청 중 오류:", err);
    return "⚠️ AI 피드백 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}
