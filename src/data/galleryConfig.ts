import type { DisplayCategory } from "../types/post";

export const galleryConfig = {
  fullName: "대한민국 헌터 갤러리",
  shortName: "헌터 갤러리",
  nickname: "헌갤",
  snapshot: "2042-09-17",

  // 프롤로그의 정확한 T0가 아직 Canon으로 확정되지 않아 현재는 당일 종료 시각을 임시 상한으로 둔다.
  // T0가 확정되면 이 값 하나만 교체하면 validator / build / UI가 동일 기준을 사용한다.
  archiveCutoff: "2042-09-18T00:00:00+09:00",
  archiveCutoffStatus: "TEMP_END_OF_DAY" as "TEMP_END_OF_DAY" | "FINAL_T0",

  pageSize: 50,
  trendingWindowDays: 7,
  trendingLimit: 6,
  categories: ["일반", "질문", "정보", "공략", "사건", "구인", "길드", "방송", "협회"] as DisplayCategory[],
  tabs: [
    { label: "전체글", to: "/board" },
    { label: "개념글", to: "/concept" },
    { label: "공지", to: "/notices" },
    { label: "고전글", to: "/classic" },
  ],
};
