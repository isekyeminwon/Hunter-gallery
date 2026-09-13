export interface ForbiddenPatternRule {
  id: string;
  description: string;
  pattern: RegExp;
}

// 정규식은 "확실히 비공개 Canon을 직접 말하는" 표현만 보수적으로 잡는다.
// 의미론적 우회표현, 추측과 사실 단정의 구분은 최종 Canon 검수 AI/수동 검수가 담당한다.
export const FORBIDDEN_PATTERNS: ForbiddenPatternRule[] = [
  {
    id: "RED_GATE",
    description: "프롤로그 이전 레드 게이트 명칭",
    pattern: /레드\s*게이트/iu,
  },
  {
    id: "FAME_ABILITY_NAME",
    description: "USER 고유능력 《명성》 직접 언급",
    pattern: /《\s*명성\s*》|(?:고유|특수|유니크)?\s*(?:능력|스킬).{0,10}명성|명성.{0,10}(?:능력|스킬)/iu,
  },
  {
    id: "USER_TOKEN",
    description: "본편 USER 식별 토큰",
    pattern: /(?:<\s*)?\bUSER\b(?:\s*>)?/iu,
  },
  {
    id: "SONG_SIAN_TRUE_RANK",
    description: "송시안의 실제 전투등급/위장등록 폭로",
    pattern: /송시안.{0,32}(?:사실|실제|진짜|본래|실은|알고\s*보니).{0,24}(?:A\+?\s*급|A\+|A급|F급\s*(?:가짜|위장)|등록\s*(?:조작|위장)|마나\s*억제)/iu,
  },
  {
    id: "SONG_SIAN_KILLER",
    description: "송시안의 살인자 정체 폭로",
    pattern: /송시안.{0,36}(?:살인범|연쇄\s*살인|킬러|사람\s*죽|실종.{0,12}범인|범인.{0,12}실종)/iu,
  },
  {
    id: "JEONG_HAYEON_TRUE_RANK",
    description: "정하연의 실제 A급 정체 폭로",
    pattern: /정하연.{0,32}(?:사실|실제|진짜|본래|실은|알고\s*보니).{0,24}A\s*급/iu,
  },
  {
    id: "GANGWON_CULPRIT_ANSWER",
    description: "강원 연쇄실종의 실제 범인 정답 노출",
    pattern: /(?:강원(?:도)?\s*)?(?:연쇄\s*)?실종.{0,44}(?:범인|배후|정답).{0,30}송시안|송시안.{0,30}(?:범인|배후|정답).{0,44}(?:강원(?:도)?\s*)?(?:연쇄\s*)?실종/iu,
  },
];
