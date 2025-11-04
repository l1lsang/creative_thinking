// src/openai.js
export async function getFeedbackFromAI(answer) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "너는 사고력 코치야. 학생의 사고 답변을 분석하고, 논리적 사고력과 창의적 사고력을 피드백해줘.",
        },
        { role: "user", content: answer },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
