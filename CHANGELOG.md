# Changelog

## v0.2.2

- 삭제·유실 18개 집계를 `flags.deleted` 단독에서 archive loss 합집합으로 수정
- final exact: 완전 삭제/소실 16 + 비삭제 첨부 유실 2 = 총 18
- 연도별 삭제·유실 집계도 합집합 기준으로 변경
- 삭제댓글 `content=""` validator 강제 및 검색 인덱스 제외
- 삭제글 본문 source 비움 강제 + public JSON에서 본문/첨부/댓글 strip
- public 개별글 JSON에서 source 전용 Canon QA 메타데이터 비움
- 검색 인덱스에서 헌갤콘 token을 `[콘]`으로 plain-text 변환
- 2042 기간별 24/26/30/42/34/36 exact validation 추가
- FINAL_T0 모드에서 마지막 9월 17일 글이 T0 1~10분 전인지 검증
- `displayNoLabel?: string` 추가 및 목록 렌더링 지원
- 삭제 상세글에서 댓글/댓글 작성 UI를 노출하지 않도록 정리

## v0.2.1 — final data hardening

### Final archive composition validator
- `REQUIRE_FULL_DATASET=1`에서 단순 `posts === 1200`만 검사하지 않고 **최종 아카이브 편성표 전체를 강제**한다.
- 개념글 144개.
- 고전글 72개.
- 삭제·유실 18개.
- 역사적 운영공지 12개.
- 내부 8분류 정확 총량 `324 / 180 / 192 / 144 / 120 / 96 / 72 / 72`.
- 2022~2042 연도별 정확 게시글 수.
- 연도 × 내부 8분류 정확 매트릭스.
- 삭제·유실 연도별 배치 수량.
- 규칙은 `scripts/archive-rules.ts` 한 곳에서 관리한다.

### HunterCon era validation fix
- 게시글 본문 헌갤콘은 게시글 연도로 검증.
- 댓글 헌갤콘은 **각 댓글 timestamp의 연도**로 검증.
- 따라서 2033년 고전글에 2042년 성지순례 댓글이 달리고 2035년 이후 콘을 사용하는 경우 정상 통과한다.

### Historical notices
- `posts` 안의 `flags.notice=true`를 역사적 운영공지로 취급.
- 일반 게시판 목록에서 작은 `공지` 태그를 표시.
- final validator에서 역사적 운영공지 정확히 12개 강제.

### Ad images
- `AdSlot.tsx`가 `ad.image`를 실제 `<img>`로 렌더링.
- lazy loading, alt, 슬롯별 기본 크기 CSS 추가.
- 광고 이미지는 `public/assets/ads/`에 넣고 `src/data/ads.json`의 `image` 경로만 지정하면 된다.

### Canon guard
- 정확 문자열 배열 대신 `scripts/forbidden-patterns.ts` 도입.
- `레드게이트`/`레드 게이트`, 명성 능력 직접 언급, USER 토큰, 송시안·정하연 비밀의 일부 자연어 변형, 강원 실종 정답 노출 패턴을 추가.
- 정규식은 1차 안전망이며 의미론적 Canon 검수 AI/수동 검수를 대체하지 않는다.

### Small stability fix
- `paginate()`가 `NaN`, 무한대, 0 이하 page/pageSize를 받아도 안전하게 1페이지/기본 크기로 정규화.

### Dependency lock
- package version을 0.2.1로 갱신.
- exact dependency pins 유지.
- 현재 실행환경에서는 npm registry 접근이 불가하므로 transitive graph가 완성된 lockfile은 개발 PC에서 최초 `npm install` 후 커밋해야 한다.

## v0.2.0 — stabilization

- exact dependency pins.
- search year/category/sort filters.
- search/concept/classic pagination.
- current-post neighbor mini list.
- generated trending index.
- comment graph validation.
- centralized archive cutoff.
- notice metadata rendering.
- deterministic duplicate-safe ads.
- ambiguous opening-year copy.
