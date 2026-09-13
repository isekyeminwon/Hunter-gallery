# 대한민국 헌터 갤러리 — 구현 안정화 명세 v1.2

이 문서는 구현 설계도 v1.1 이후, 실제 1,200개 콘텐츠 투입 전에 반드시 반영할 안정화 변경사항을 기록한다.

## 확정 변경

1. 모든 직접 npm 의존성은 exact version으로 고정한다. `latest`, `^`, `~`를 사용하지 않는다.
2. 검색은 `연도 + 화면 말머리 + 최신/오래된/인기순`을 동시에 지원한다.
3. 말머리 URL은 `/board?category=` 한 방식으로 통일하며 미사용 `/category/:category` 라우트는 제거한다.
4. 상세글 미니목록은 현재 글 기준 앞뒤 게시글을 보여준다.
5. 우측 `실시간 많이 본 글`은 `trending-index.json`에서 읽는다. 빌드 시 최근 7일 비삭제 게시글에서 자동 산출한다.
6. 검색/개념글/고전글은 게시판과 동일한 50개 pagination을 사용한다.
7. 댓글 validator는 local/global ID 중복, self-parent, missing parent, parent cycle, parent timestamp 역전을 차단한다.
8. 프롤로그 진입 시각은 `galleryConfig.archiveCutoff` 단일 설정으로 관리한다. T0 확정 전에는 임시 end-of-day 상태를 명시한다.
9. 고정공지 행은 실제 author/timestamp/stats를 사용한다.
10. 광고는 pathname+slot deterministic selection을 사용하고 동일 페이지에서 같은 ad id를 중복 사용하지 않는다.
11. UI에서 정확한 `개설 2024` Canon을 만들지 않는다. `운영 20년차`로 표현한다.

## 완료 조건

- 1,200개 투입 전 validator가 댓글 graph 오류를 차단할 것
- 검색 결과가 수백 개여도 pagination이 유지될 것
- 고전글 72개/개념글 144개가 한 화면에 전부 렌더링되지 않을 것
- 2033년 상세글 아래에 2042 최신글만 뜨지 않을 것
- 우측 인기글과 실제 JSON 데이터가 자동 동기화될 것
- T0 확정 시 설정 한 곳만 수정할 것
