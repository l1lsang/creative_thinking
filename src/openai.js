export async function getThinkingFeedback(formData) {
  try {
    const res = await fetch("/api/getThinkingFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("서버 응답 오류");

    const { feedback } = await res.json();
    return feedback; // 단순 텍스트
  } catch (error) {
    console.error("❌ getThinkingFeedback Error:", error);
    return "AI 피드백 생성 중 오류가 발생했습니다.";
  }
}
