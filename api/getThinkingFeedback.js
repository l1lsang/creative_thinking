import OpenAI from "openai";

// 🔐 Vercel 환경 변수에서 OpenAI API 키 불러오기
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // ✅ POST 요청만 허용
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const form = req.body;

    // 🧠 AI 프롬프트: JSON 금지, 자연스러운 마크다운 피드백 요청
    const prompt = `
너는 "사고력 코치" 역할을 맡고 있어.
학생이 작성한 사고 훈련 기록을 보고, **GPT처럼 자연스럽고 따뜻한 말투로**, 
**마크다운(Markdown)** 형식으로 피드백을 작성해줘.

절대로 JSON이나 코드블록을 출력하지 말고, 
사람이 읽기 좋은 마크다운 문서 형식으로 써야 해.

---

## 🧭 기본 정보
- 날짜: ${form.date || "미입력"}
- 주제: ${form.topic}
- 목표: ${form.goal}

---

## 💡 학생의 사고 기록 요약
- 사전 지식: ${form.priorKnowledge}
- 전략 및 활동: ${form.strategy}
- 근거 및 출처: ${form.sources}
- 분석 및 대안 탐색: ${form.analysis}
- 협력 활동: ${form.collaboration}
- 반성: ${form.reflection}
- 어려움/개선: ${form.difficulty}
- 감정 상태: ${form.emotion}
- 장기적 의미: ${form.longTermMeaning}
- 실행 계획: ${form.todo}

---

## ✨ 작성 지침
- JSON 형식 절대 금지
- 문단, 리스트, 헤더, 강조, 이모지 등 자유롭게 사용
- 피드백은 다음 구조를 따라줘:

# 🧠 사고력 피드백
### 🌟 종합 요약
(학생의 사고 과정 전체를 2~3문장으로 정리)

### 💪 강점
- (구체적 강점 2~3개)

### 🧩 개선 제안
- (개선할 점 2~3개)

### 🌿 성장 방향
(앞으로 발전할 방향을 따뜻하게 제시)

### 📊 시각적 요약 제안
텍스트로 그래프나 마인드맵을 묘사해도 돼.
예:  
- 논리적 사고: ███████░░░ 70%  
- 비판적 사고: █████░░░░ 60%  
- 개선 가능성: ██████░░░░ 65%

---

## 🎨 참고
너의 말투는 따뜻하고, 코멘트는 구체적으로 써줘.  
학생이 나중에 읽을 때 **"AI가 정말 내 생각을 이해했구나"** 느낄 만큼 자연스럽게.

---

학생의 기록은 다음과 같아:
${JSON.stringify(form, null, 2)}
`;

    // 💬 GPT 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // 📘 GPT 응답 추출
    const feedback = completion.choices[0].message.content;

    // ✅ 프론트엔드로 피드백 반환
    res.status(200).json({ feedback });
  } catch (error) {
    console.error("❌ OpenAI 서버 오류:", error);
    res.status(500).json({ error: "서버 내부 오류", details: error.message });
  }
}
