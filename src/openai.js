// src/openai.js
import json5 from "json5"; // ⚙️ JSON 파싱 보강 (npm i json5 필요)

// ====== SYSTEM PROMPT (코치 역할) ======
const SYSTEM_PROMPT = `
당신은 ‘생각하는 공간’의 코치입니다. 목표: 학생이 스스로 생각하고 실행하도록 돕는 것.
원칙:
- 정답 제시 X, 좋은 질문으로 사고를 확장.
- 학생의 현재 맥락을 존중하고, 구체적·실행 가능한 피드백.
- 간결, 따뜻, 명료. 불필요한 장황함 금지.
- 각 항목은 반드시 JSON 스키마에 맞춰 출력.

평가 기준(반드시 모두 다룸):
1) 목표 구체성 평가
2) 선행 지식/가정에서 추가로 예상되는 어려움 제시
3) (2)에 대한 ‘질문형’ 해결 가이드(완전한 해법 금지)
4) 전략/활동의 ‘상세도’ 평가
5) 전략/활동의 ‘논리적 타당성’ 평가
6) 목표 ↔ 결론의 연관성 평가
7) 성과평가: 근거 확인 및 점수-근거 정합성 검토
8) 새로 알게 된 내용: 핵심 재강조
9) 어려움/개선에 도움 되는 ‘좋은 질문’과 방법 제안
10) 기한(월/일) 명시 여부 확인
11) 해야 할 일과 문제 적합성 평가

출력은 아래 JSON 스키마에 ‘정확히’ 맞춰라.
모든 섹션에 최소 1개 이상의 ‘좋은 질문’을 포함하되, 전체 질문 수는 6~12개 범위.
어조: 코치/현자. 학생이 오늘 당장 실행할 수 있게끔 마무리에 ‘다음 행동 1~3개’를 제시.
`;

// ====== USER PROMPT TEMPLATE ======
const USER_PROMPT_TEMPLATE = `
[학생 기록]
{student_record_json}

위 기록을 평가 기준(1~11)에 따라 분석하고, ‘질문 중심’ 피드백을 생성하라.
출력은 반드시 아래 JSON 스키마(키/타입/필수 여부)와 동일한 구조로만 응답하라.
`;

// ====== 사용자 입력 → 프롬프트 변환 ======
function buildUserPrompt(studentRecord) {
  return USER_PROMPT_TEMPLATE.replace(
    "{student_record_json}",
    JSON.stringify(studentRecord, null, 2)
  );
}

// ====== 🧠 사고력 피드백 생성 ======
export async function getThinkingFeedback(formData) {
  try {
    // formData → student_record 구조로 변환
    const studentRecord = {
      "A_기본정보": {
        "날짜": formData.date || "",
        "ID": formData.userId || "",
        "주제": formData.topic || "",
        "문제유형": formData.problemType || [],
      },
      "B_사전사고": {
        "목표설정": formData.goal || "",
        "선행지식": formData.priorKnowledge || "",
        "가정": "",
      },
      "C_사고과정": {
        "전략및활동": formData.strategy || "",
        "예시활동": ["피드백 과정 작성", "근거 탐색", "정의하기", "연구하기", "토론하기"],
        "중간메모": formData.analysis || "",
      },
      "D_사고후반성": {
        "성과평가_점수_0to100": Number(formData.evaluation) * 20 || 0,
        "성과근거": formData.reflection || "",
        "새로알게된내용": formData.reflection || "",
        "어려움": formData.difficulty || "",
        "개선방안": "",
      },
      "E_실행계획점검": {
        "무엇을": formData.todo || "",
        "언제까지(월/일)": formData.deadline || "",
        "활용자료": formData.resources || "",
      },
    };

    const prompt = buildUserPrompt(studentRecord);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1800,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("응답 없음");

    // ✅ GPT JSON 파싱
    let parsed;
    try {
      parsed = json5.parse(content);
    } catch (err) {
      console.warn("⚠️ JSON 파싱 오류, 원문 출력:", content);
      parsed = {
        meta: { 요약: "파싱 실패", 톤: "따뜻한_코치", 총_질문_개수: 0 },
        평가: {},
        "다음_행동(당장_실행_1~3개)": [],
      };
    }

    return parsed;
  } catch (error) {
    console.error("OpenAI 요청 오류:", error);
    return {
      meta: { 요약: "AI 피드백 생성 실패", 톤: "차분한_현자", 총_질문_개수: 0 },
      평가: {},
      "다음_행동(당장_실행_1~3개)": [],
    };
  }
}

// ====== 📊 관리자 요약 함수 ======
export async function getAdminSummary(records) {
  try {
    const summaryText = records
      .map(
        (r, i) =>
          `(${i + 1}) ${r.topic || "제목 없음"} - 목표: ${r.goal || "-"}, 통찰: ${
            r.reflection || "-"
          }`
      )
      .slice(0, 20)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 교육 데이터 분석가이자 사고력 코치야. 학생들의 사고 훈련 기록을 종합해서 주요 패턴, 강점, 개선점, 다음 목표를 요약해줘.",
          },
          {
            role: "user",
            content: `
다음은 학생들의 사고 기록이야:
${summaryText}

이 데이터를 분석해서 아래 항목으로 요약해줘.
1️⃣ 주요 경향
2️⃣ 공통 강점
3️⃣ 자주 드러나는 어려움
4️⃣ 다음 단계 제안
          `,
          },
        ],
        temperature: 0.6,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "AI 요약 생성 실패 😢";
  } catch (error) {
    console.error("AI 요약 오류:", error);
    return "요약 중 오류 발생 ❌";
  }
}
