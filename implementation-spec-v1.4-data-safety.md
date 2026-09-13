# 대한민국 헌터 갤러리 — 구현 명세 v1.4 데이터 안전 / 아카이브 최종 하드닝

## 목적

1,200개 본데이터 투입 직전의 마지막 구조 보강이다. v0.2.1 구조를 유지하고 삭제·유실 정의, 정적 JSON 노출, 2042 세부 편성, 초기 외부기록 표시만 엄격히 수정한다.

## 삭제·유실 exact rule

- `archiveLoss = post.flags.deleted || attachments.some(status === "lost")`
- 합집합: 18
- 완전 삭제/소실(`flags.deleted=true`): 16
- 본문 생존 + 첨부 유실(`flags.deleted=false && lost attachment`): 2
- 연도별 18개 배치도 `archiveLoss` 기준

## public 데이터 안전

- 삭제댓글 source content는 반드시 빈 문자열
- 삭제댓글은 search index에서 제외
- 완전 삭제글 source content도 빈 문자열
- build 시 완전 삭제글 public JSON에서 본문/첨부/댓글 strip
- public 개별글의 source 전용 Canon QA metadata는 비움

## 검색 텍스트

`{{con:slug}}`는 검색용 파생 텍스트에서 `[콘]`으로 치환한다. 실제 게시글 렌더링은 기존 React node parser를 그대로 사용한다.

## 2042 세부 편성

- 1~2월 24
- 3~4월 26
- 5~6월 30
- 7~8월 42
- 9월 1~16일 34
- 9월 17일 36

`FINAL_T0` 전환 후 마지막 9월 17일 글은 T0 1~10분 전이어야 한다.

## 초기 외부기록 표시

`displayNo`는 숫자 필수로 유지한다. `displayNoLabel?: string`이 존재하면 목록 번호 칸에서 라벨을 우선 표시한다. 예: `외부기록`, `캡처본`, `재업`.
