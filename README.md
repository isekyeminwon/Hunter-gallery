# 대한민국 헌터 갤러리 v0.2.2

React + Vite + TypeScript 기반의 정적 헌터 커뮤니티 SPA입니다.

- 공식명: **대한민국 헌터 갤러리**
- 약칭: **헌갤**
- 현재 프레임 시점: **2042-09-17**
- 핵심 연출: 읽기/검색/탐색은 정상 동작하지만 글쓰기·댓글·추천·신고·로그인·회원가입은 origin 오류와 함께 실패
- 배포 대상: **Cloudflare Pages**
- 커뮤니티 위상: **2042년 기준 대한민국 최대 규모의 헌터 전문 익명 커뮤니티**

## v0.2.2 데이터 안전·아카이브 편성 최종 하드닝

1. `삭제·유실 18개`를 단순 `flags.deleted`가 아니라 **완전 삭제/소실 또는 첨부 유실의 합집합**으로 계산합니다.
2. 최종 편성은 **완전 삭제/소실 16개 + 본문은 살아 있고 첨부만 유실된 글 2개 = 총 18개**로 강제합니다. 연도별 삭제·유실 배치도 같은 합집합 기준입니다.
3. 삭제댓글은 source 단계부터 `content: ""`를 강제하고, 검색 인덱스에서는 삭제댓글을 완전히 제외합니다.
4. 완전 삭제글은 source 본문도 빈 문자열을 강제하고, public 개별글 JSON에서는 본문·첨부·댓글을 strip합니다.
5. 방어적으로 public JSON의 `canon.keywords` / `canon.forbiddenKnowledge`도 비워 source 전용 QA 메타데이터가 브라우저에 노출되지 않게 합니다.
6. 검색 인덱스 생성 시 `{{con:slug}}`를 `[콘]`으로 정리하여 검색 미리보기에 내부 토큰이 그대로 보이지 않게 합니다.
7. 2042년 세부 편성 `24 / 26 / 30 / 42 / 34 / 36`을 final validator에서 정확히 강제합니다.
8. `archiveCutoffStatus = FINAL_T0`가 되면 2042-09-17 마지막 글이 **T0 1~10분 전**인지 자동 검사합니다.
9. `displayNoLabel?: string`을 추가하여 2022~2023 외부 기록에 `외부기록`, `캡처본`, `재업` 같은 표시를 사용할 수 있습니다. 내부 `displayNo` 숫자는 그대로 유지됩니다.
10. v0.2.1의 편성표 exact validation, 댓글 graph 검증, Canon pattern guard, 광고 이미지, 검색/페이지네이션/주변글/trending index는 그대로 유지됩니다.

## 현재 샘플 데이터

기능 검수용으로 다음이 포함됩니다.

- 샘플 게시글: **21개**
- 샘플 댓글: **45개**
- 현재 고정공지: **5개**
- 실제 최종 목표: **1,200개 아카이브 게시글**

최종 데이터는 `source/hunter-gallery-master.json`의 `posts`를 교체/확장하면 됩니다.

## 의존성 잠금에 대한 중요 메모

직접 의존성은 전부 exact version으로 고정되어 있습니다.

```text
react              18.3.1
react-dom          18.3.1
react-router-dom   6.28.2
zod                3.24.2
@vitejs/plugin-react 4.3.4
tsx                4.19.2
typescript         5.8.3
vite               6.1.0
```

이 제작 환경은 npm registry DNS 접근이 차단되어 있어 **transitive dependency까지 채워진 완전한 package-lock을 여기서 실제 `npm install`로 재생성할 수 없었습니다.** 저장소에는 root manifest lock이 포함되어 있습니다.

인터넷 가능한 개발 PC에서 최초 1회:

```powershell
npm install
```

을 실행하면 npm이 현재 exact pin을 기준으로 `package-lock.json`의 전체 dependency graph를 완성합니다. 그 결과의 `package-lock.json`을 Git에 커밋한 뒤부터는:

```powershell
npm ci
```

사용을 권장합니다.

즉, **`latest`로 인한 미래 메이저 업그레이드 위험은 제거**했고, 완전한 transitive lock 생성만 네트워크 가능한 환경에서 최초 1회 필요합니다.

## 로컬 실행

아래 명령은 **PowerShell / Windows Terminal**에서 실행합니다.

```powershell
cd hunter-gallery-v0.2.2
npm install
npm run dev
```

`npm run dev` 전에 `predev`가 자동으로 데이터 검증 → `public/generated` 재생성을 수행합니다.

## 프로덕션 빌드

```powershell
npm run build
```

출력:

```text
dist/
```

Cloudflare Pages:

```text
Build command: npm run build
Build output directory: dist
Production branch: main
```

SPA fallback은 `public/_redirects`에 이미 포함되어 있습니다.

```text
/* /index.html 200
```

## 데이터 파이프라인

사람이 관리하는 원본:

```text
source/hunter-gallery-master.json
```

```json
{
  "version": "1.1",
  "snapshot": "2042-09-17",
  "notices": [],
  "posts": []
}
```

빌드 결과:

```text
public/generated/
├─ post-index.json
├─ search-index.json
├─ concept-index.json
├─ trending-index.json
├─ notices.json
├─ years/
└─ posts/
```

### 실시간 많이 본 글

`trending-index.json`은 현재 `archiveCutoff` 직전 **7일간의 비삭제 게시글** 중 조회수 우선, 인기점수 보조 기준으로 상위 6개를 자동 생성합니다.

설정:

```ts
trendingWindowDays: 7
trendingLimit: 6
```

## 검색

검색 범위:

- 제목
- 제목+본문
- 작성자
- 댓글

필터:

- 연도 2022~2042
- 화면 말머리
- 최신순
- 오래된순
- 인기순

검색결과는 50개 단위 페이지네이션을 사용합니다.

## 개념글 / 고전글

- 개념글: 최신순 / 인기순, 50개 단위 페이지네이션
- 고전글: 50개 단위 페이지네이션
- 인기점수: `추천 × 2 + 댓글 수`

## 상세글 주변 목록

상세글 하단에는 전체 최신글이 아니라 현재 글이 `post-index`에서 위치한 지점을 기준으로 **앞뒤 최대 4개씩, 총 9개**를 보여줍니다. 현재 글은 강조 표시됩니다.

## 프롤로그 컷오프

단일 설정:

```ts
src/data/galleryConfig.ts
```

현재는 정확한 게이트 진입 시각 T0가 아직 Canon으로 확정되지 않아 임시로:

```ts
archiveCutoff: "2042-09-18T00:00:00+09:00"
archiveCutoffStatus: "TEMP_END_OF_DAY"
```

를 사용합니다.

**T0가 확정되면 `archiveCutoff` 값을 정확한 시각으로 바꾸고 `archiveCutoffStatus`를 `FINAL_T0`로 변경합니다.** validator는 게시글과 댓글 모두 해당 시각 이후 데이터를 거부합니다.

## validator 강화

항상 검사:

- post id / displayNo 중복
- 전체 및 게시글 내부 comment id 중복
- 존재하지 않는 parentId
- `parentId === 자기 id`
- 댓글 parent cycle
- 대댓글이 부모댓글보다 과거인지
- 댓글이 게시글보다 과거인지
- 게시글/댓글이 `archiveCutoff` 이후인지
- `flags.deleted`와 `deletedStatus` 일치
- 제목 내 헌갤콘 토큰
- 없는 헌갤콘 slug
- 헌갤콘 시대 제한
  - 본문: 게시글 연도
  - 댓글: **댓글 자체 timestamp 연도**
- `forbidden-patterns.ts` 기반 금지 Canon 1차 패턴
- 현재 고정공지 정확히 5개

최종 데이터셋 모드에서는 추가로 **편성표 전체를 exact count**로 강제합니다.

| 항목 | 최종 수량 |
|---|---:|
| 아카이브 게시글 | 1,200 |
| 개념글 | 144 |
| 고전글 | 72 |
| 삭제·유실 합집합 | 18 |
| └ 완전 삭제/소실 | 16 |
| └ 첨부 유실 중심 반쯤 유실 | 2 |
| 역사적 운영공지 | 12 |
| 뻘글·잡담 | 324 |
| 질문·뉴비 | 180 |
| 공략·실무 | 192 |
| 갈드컵·랭킹 | 144 |
| 사건·속보 | 120 |
| 팬덤·방송 | 96 |
| 시장·구인 | 72 |
| 협회·법·범죄 | 72 |

여기에 **연도별 게시글 총량, 연도×내부분류 매트릭스, 삭제·유실 연도별 배치, 2042 세부 기간 24/26/30/42/34/36**까지 `scripts/archive-rules.ts` 기준으로 정확히 검사합니다.

최종 데이터셋 강제는 OS와 관계없이 아래 명령 하나로 실행할 수 있습니다.

```powershell
npm run data:validate:final
```

내부적으로 `REQUIRE_FULL_DATASET=1`을 켠 뒤 같은 validator를 실행합니다.

정규식 Canon guard는 의미론 검수를 대체하지 않습니다. `정하연`, `송시안`, 강원 실종처럼 **추측/농담/사실 단정의 문맥 차이**가 중요한 비밀은 1,200개 완성 후 Canon 검수 AI 또는 수동 검수를 별도로 수행해야 합니다.

## 삭제 데이터의 public 노출 방지

정적 사이트에서는 `/generated/posts/*.json`을 직접 열 수 있으므로 삭제 연출만 UI에 두면 충분하지 않습니다. v0.2.2부터 다음을 강제합니다.

- `comment.deleted === true`이면 source의 `content` 자체가 `""`여야 합니다.
- 삭제댓글은 `search-index.json`의 `commentText`에 포함하지 않습니다.
- 완전 삭제글은 source의 `content`도 `""`여야 합니다.
- build 시 완전 삭제글의 public 개별 JSON에서 `content`, `attachments`, `comments`를 제거합니다. 목록용 `commentCount`는 source 기준으로 이미 계산되어 메타데이터로 남습니다.
- public 개별 JSON의 source 전용 Canon QA 필드는 빈 배열로 정리됩니다.

## 2022~2023 외부기록 번호 표시

숫자 `displayNo`는 내부 정렬/고유 메타데이터용으로 유지하면서 화면에서는 선택적으로 다른 라벨을 표시할 수 있습니다.

```json
{
  "displayNo": 12031,
  "displayNoLabel": "외부기록"
}
```

`displayNoLabel`이 없으면 기존 숫자 번호가 그대로 표시됩니다. 권장 라벨은 `외부기록`, `캡처본`, `재업` 정도입니다.

## 광고

광고는 항상 2042-09-17 현재 광고입니다.

- `header-banner`
- `right-sidebar`
- `post-inline`

`AdProvider`가 현재 pathname과 슬롯을 기준으로 deterministic하게 광고를 선택합니다. 같은 광고 id가 한 화면에서 두 슬롯에 중복되지 않게 선택합니다.

### 광고 이미지를 나중에 추가하는 위치

**1. 이미지 파일을 넣습니다.**

```text
public/assets/ads/
```

예:

```text
public/assets/ads/daeyoung-insurance.webp
public/assets/ads/saebyeok-motors-fall.webp
```

**2. `src/data/ads.json`의 해당 광고 `image`에 브라우저 경로를 적습니다.**

```json
{
  "id": "ad-2042-001",
  "slot": ["header-banner"],
  "brand": "대영손해보험",
  "headline": "게이트는 예고 없이 열립니다.",
  "subline": "헌터·지원인력 위험직군 보장 상담",
  "image": "/assets/ads/daeyoung-insurance.webp",
  "active": true
}
```

`image: null`이면 기존처럼 텍스트 광고만 렌더링합니다. 이미지 경로가 있으면 `AdSlot.tsx`가 자동으로 lazy-load 이미지를 표시합니다.

권장 제작 비율은 대략:

- 가로 배너: 4:1 ~ 6:1
- 우측 사이드: 4:3 ~ 1:1
- 본문 인라인: 4:1 ~ 6:1

한 광고를 서로 매우 다른 비율의 슬롯에 동시에 쓰면 crop이 생길 수 있으므로, 실제 이미지 제작 단계에서는 슬롯별 광고를 분리하는 편이 가장 깔끔합니다.

## 헌갤콘 추가 방법

### 현재 별하나콘

현재 파일은:

```text
public/assets/cons/byulhana/
```

에 있습니다.

### 새 콘을 추가할 때

**1. 이미지 파일 추가**

```text
public/assets/cons/<팩이름>/<slug>.webp
```

예:

```text
public/assets/cons/default/thumbsup.webp
public/assets/cons/byulhana/new_reaction.webp
```

**2. `src/data/emoticons.json`에 등록**

```json
{
  "slug": "new_reaction",
  "pack": "byulhana",
  "src": "/assets/cons/byulhana/new_reaction.webp",
  "alt": "별하나 새 리액션 콘",
  "availableFromYear": 2035
}
```

**3. 게시글 본문 또는 댓글에서 토큰 사용**

```text
{{con:new_reaction}}
```

주의:

- 제목에는 헌갤콘을 넣지 않습니다. validator가 막습니다.
- slug는 **대소문자를 구분**합니다. `Intelligence`처럼 대문자 slug도 그대로 유지합니다.
- `availableFromYear` 이전 콘텐츠에서는 사용할 수 없습니다.
- 오래된 게시글에 나중에 달린 댓글은 **댓글 작성연도**를 기준으로 검사하므로 성지순례/끌올 댓글에서 최신 콘을 쓰는 것은 정상입니다.
- 콘 이미지를 추가한 뒤에는 `npm run data:validate`로 slug/연도 오류를 확인합니다.

## 읽기 성공 / 쓰기 실패

정상:

- 글 목록 / 상세글 / 댓글
- 검색 / 정렬 / 필터
- 개념글 / 공지 / 고전글
- 이미지 확대
- 페이지 이동

항상 실패:

- 글쓰기
- 댓글 등록
- 추천
- 신고
- 로그인
- 회원가입

사용자가 입력한 정보는 서버, localStorage, analytics에 저장하지 않습니다.

## 주요 디렉터리

```text
src/                  React 앱
source/               사람이 관리하는 원본 JSON
scripts/              검증 및 인덱스 생성
  archive-rules.ts     최종 1,200개 편성표 exact rules
  forbidden-patterns.ts 비공개 Canon 정규식 1차 안전망
public/generated/     빌드된 읽기 전용 데이터
public/assets/        광고/헌갤콘/게시글 이미지
public/_redirects     Cloudflare Pages SPA fallback
docs/                 설계도 / 아카이브 마스터 / 변경내역
```
