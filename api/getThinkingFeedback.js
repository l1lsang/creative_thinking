import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const form = req.body;

    const prompt = `
너는 "사고력 코치"야.  
학생의 사고 기록을 읽고 따뜻하게 피드백을 주되,  
**마크다운(Markdown)** 형식으로 작성해.

절대 JSON으로 쓰지 말고,  
사람이 읽기 좋게 꾸며줘.  
마지막에는 **텍스트 형태의 마인드맵 구조 요약**도 함께 넣어줘.  
(예: "📚 문학 → 🧠 이해 → 🔹 정확성 / 🔹 연구 / 💬 AI 제안: 분석력 향상")

---

## 🗓️ 기본 정보
- 날짜: ${form.date || "미입력"}
- 주제: ${form.topic}
- 목표: ${form.goal}

---

## 💡 사고 기록 요약
- 선행 지식: ${form.priorKnowledge}
- 전략 및 활동: ${form.strategy}
- 분석 및 대안 탐색: ${form.analysis}
- 협력 활동: ${form.collaboration}
- 반성: ${form.reflection}
- 어려움/개선: ${form.difficulty}
- 감정 상태: ${form.emotion}
- 장기적 의미: ${form.longTermMeaning}
- 실행 계획: ${form.todo}

---

## 🧠 작성 지침
너의 답변은 아래 구조로 써줘.

# 🧠 사고력 피드백
### 🌟 종합 요약
(학생의 전체 사고 흐름 요약 2~3문장)

### 💪 강점
- (강점 1)
- (강점 2)

### 🧩 개선 제안
- (개선 1)
- (개선 2)

### 🌿 성장 방향
(학생이 다음 단계로 성장할 수 있는 방향 제시)

---

### 🌳 사고 구조 요약 (텍스트 마인드맵)
학생의 선택(문학/비문학, 초점, 유형)에 맞게  
간단한 마인드맵을 텍스트로 만들어줘.

예시👇
📚 문학  
 ┣ 🧠 이해  
 ┃ ┣ 🔹 정확성  
 ┃ ┣ 🔹 연구  
 ┗ 💬 AI 제안: 분석 과정이 체계적이며 논리적 사고가 좋음

---

학생의 데이터:
${JSON.stringify(form, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = completion.choices[0].message.content;

    res.status(200).json({ feedback });
  } catch (error) {
    console.error("❌ OpenAI 서버 오류:", error);
    res.status(500).json({ error: "서버 내부 오류", details: error.message });
  }
}
