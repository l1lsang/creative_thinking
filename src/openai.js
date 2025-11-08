// src/openai.js (또는 src/getThinkingFeedback.js)
export async function getThinkingFeedback(formData) {
  try {
    const response = await fetch("/api/getThinkingFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("서버 응답 오류");
    }

    const data = await response.json();
    return data.feedback; // ✅ 문자열 그대로 받음
  } catch (err) {
    console.error("❌ getThinkingFeedback Error:", err);
    throw err;
  }
}
