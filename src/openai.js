// src/openai.js
export async function getThinkingFeedback(formData) {
  try {
    const res = await fetch("/api/getThinkingFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("서버 응답 오류");

    const { feedback } = await res.json();
    return feedback;
  } catch (error) {
    console.error("❌ getThinkingFeedback Error:", error);
    return { summary: "AI 분석 실패", error: error.message };
  }
}
