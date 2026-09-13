export type MutationAction = "WRITE_POST" | "WRITE_COMMENT" | "RECOMMEND" | "REPORT" | "LOGIN" | "REGISTER";

export const mutationMessages: Record<MutationAction, { title: string; body: string[]; code: string }> = {
  WRITE_POST: {
    title: "게시 요청이 거부되었습니다.",
    body: ["이 세션에서는 기록을 남길 수 없습니다.", "접속 좌표가 서비스 유효 범위 밖에 있습니다.", "이 환경에서는 새 기록을 생성할 수 없습니다."],
    code: "ACCESS_ORIGIN_UNVERIFIED",
  },
  WRITE_COMMENT: {
    title: "댓글을 전송하지 못했습니다.",
    body: ["현재 접속 환경에서는 쓰기 채널을 사용할 수 없습니다.", "입력한 내용은 저장되지 않았습니다."],
    code: "ERR_WRITE_ORIGIN_INVALID",
  },
  RECOMMEND: {
    title: "반응 데이터 동기화에 실패했습니다.",
    body: ["현재 세션의 접속 출처를 확인할 수 없습니다."],
    code: "ACCESS_ORIGIN_UNVERIFIED",
  },
  REPORT: {
    title: "요청을 처리할 수 없습니다.",
    body: ["운영 서버에서 현재 세션의 사용자 정보를 확인하지 못했습니다."],
    code: "SESSION_IDENTITY_UNRESOLVED",
  },
  LOGIN: {
    title: "사용자 인증에 실패했습니다.",
    body: ["현재 접속 환경에서 발급된 계정 정보를 확인할 수 없습니다."],
    code: "ACCESS_ORIGIN_UNVERIFIED",
  },
  REGISTER: {
    title: "신규 계정 생성이 제한되어 있습니다.",
    body: ["지원되지 않는 접속 환경입니다."],
    code: "ACCOUNT_ORIGIN_UNSUPPORTED",
  },
};
