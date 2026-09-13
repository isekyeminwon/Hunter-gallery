# 대한민국 헌터 갤러리 — React + Vite 구현 설계도 v1.1

> 프로젝트: 《저기요, 저 진짜 F급이라니까요?》
>
> 공식명: **대한민국 헌터 갤러리**
>
> 약칭: **헌갤**
>
> 프런트엔드: **React + Vite + TypeScript**
>
> 배포 기준: **Cloudflare Pages 호환 정적 SPA**
>
> 핵심 연출 원칙: **관측은 가능하지만 간섭은 불가능하다.**
>
> 위 문장은 사이트 안에서 직접 설명하지 않는다. 사용자는 기능을 눌러보며 규칙을 스스로 발견한다.

---

# 0. 문서 목적

이 문서는 대한민국 헌터 갤러리를 실제 구현하기 위한 **UI·프런트엔드·데이터·콘텐츠 파이프라인 최종 구현 명세**다.

이 문서를 기준으로 Phase 1 구현에 바로 진입한다.

핵심 목표:

1. 디시인사이드 계열 한국식 익명 게시판의 고밀도 표형 레이아웃을 골격으로 사용한다.
2. 특정 사이트를 픽셀 단위로 복제하지 않고 자체 로고·색·탭·버튼·아이콘·간격을 사용한다.
3. 2042년 사이트답게 아주 조금만 정돈된 시각적 완성도를 추가한다.
4. PC와 모바일을 하나의 React 코드베이스로 지원한다.
5. 1,200개 이상의 게시글·댓글을 단일 원본 JSON으로 대량 투입할 수 있어야 한다.
6. 게시글·댓글·추천수·조회수·첨부 이미지·삭제 상태·헌갤콘을 게시글 단위로 관리한다.
7. 검색·개념글·고전글·연도 필터를 빌드 단계에서 자동 생성한다.
8. 글쓰기·댓글·추천·신고·로그인·회원가입은 UI상 존재하지만 항상 실패한다.
9. 광고와 헌갤콘은 데이터 파일만 추가하여 확장할 수 있어야 한다.
10. 본편 시뮬레이션과 헌터갤은 완전히 분리한다.

---

# 1. 사이트 정체성

## 1.1 공식 명칭

- 공식명: **대한민국 헌터 갤러리**
- 약칭: **헌갤**
- 사이트 헤더: `대한민국 헌터 갤러리`
- 게시글·댓글 속 이용자 표현: 대부분 `헌갤`

```ts
export const galleryConfig = {
  fullName: "대한민국 헌터 갤러리",
  shortName: "헌터 갤러리",
  nickname: "헌갤",
};
```

## 1.2 커뮤니티 위상

> **2042년 기준 대한민국 최대 규모의 헌터 전문 익명 커뮤니티.**

이용자층:

- 현역 헌터
- F급 짐꾼
- 길드 관계자
- 협회 관계자라고 주장하는 이용자
- 헌터 지망생
- 일반인
- 팬덤
- 방송 시청자
- 업계 종사자

이 설정은 조회수·댓글수·광고 규모·검색량을 생성할 때 기준으로 사용한다.

## 1.3 사이트의 현재 시점

- 사이트 프레임은 **2042년 9월 17일 현재**다.
- 사용자는 2022~2042년 과거 게시글을 현재 살아 있는 헌갤 서버에서 열람한다.
- 과거 게시글을 열어도 **사이트 프레임 광고는 2042년 현재 광고**다.
- 과거 게시글 첨부 이미지 안에 찍힌 과거 광고는 허용한다.

## 1.4 본편과의 분리

금지:

- 본편 LLM이 헌터갤을 참조
- USER를 특정하는 정보
- 《명성》 언급
- 레드 게이트 사전 언급
- 프롤로그 결과 반영
- 플레이 이후 자동 게시글 추가

---

# 2. UX 핵심 규칙

## 2.1 읽기 요청은 성공

정상 동작:

- 게시글 목록 열람
- 게시글 본문 열람
- 댓글 열람
- 검색
- 연도 필터
- 말머리 필터
- 개념글
- 공지
- 고전글
- 이미지 확대
- 페이지 이동

## 2.2 저 세계에 데이터를 남기는 요청은 실패

항상 실패:

- 글쓰기
- 댓글 등록
- 추천
- 신고
- 로그인
- 회원가입

설정적 핵심은 다음과 같다.

> **관측은 가능하지만 간섭은 불가능하다.**

사이트 내부에서는 이 문장을 직접 설명하지 않는다.

---

# 3. 쓰기 실패 UX

## 3.1 글쓰기

버튼은 정상적으로 눌린다.

```text
게시 요청이 거부되었습니다.

이 세션에서는 기록을 남길 수 없습니다.
접속 좌표가 서비스 유효 범위 밖에 있습니다.

이 환경에서는 새 기록을 생성할 수 없습니다.

ACCESS_ORIGIN_UNVERIFIED
```

## 3.2 댓글

사용자는 실제로 댓글을 입력할 수 있다.

```text
댓글을 입력하세요...
                         [등록]
```

등록 클릭:

```text
댓글을 전송하지 못했습니다.

현재 접속 환경에서는 쓰기 채널을 사용할 수 없습니다.

입력한 내용은 저장되지 않았습니다.

ERR_WRITE_ORIGIN_INVALID
```

입력값은 React 로컬 상태에만 존재한다.

금지:

- 서버 전송
- localStorage 저장
- analytics payload 저장
- 로그 파일 저장

실패 연출 후 입력값을 폐기한다.

## 3.3 추천

기본:

```text
추천 381
```

클릭 직후:

```text
추천 382
```

약 300ms 후:

```text
추천 381
```

토스트:

```text
반응 데이터 동기화에 실패했습니다.

ACCESS_ORIGIN_UNVERIFIED
```

원본 JSON은 변경하지 않는다.

## 3.4 신고

```text
요청을 처리할 수 없습니다.

운영 서버에서 현재 세션의 사용자 정보를 확인하지 못했습니다.

SESSION_IDENTITY_UNRESOLVED
```

## 3.5 로그인

```text
사용자 인증에 실패했습니다.

현재 접속 환경에서 발급된 계정 정보를 확인할 수 없습니다.

ACCESS_ORIGIN_UNVERIFIED
```

실제 인증 요청을 보내지 않는다.

## 3.6 회원가입

```text
신규 계정 생성이 제한되어 있습니다.

지원되지 않는 접속 환경입니다.

ACCOUNT_ORIGIN_UNSUPPORTED
```

---

# 4. 레이아웃 방향

## 4.1 벤치마크 원칙

**한국식 갤러리형 고밀도 게시판 구조**를 사용한다.

특정 기존 사이트를 픽셀 단위로 복제하지 않는다.

자체 요소:

- 자체 로고
- 자체 남청색 계열
- 자체 탭 스타일
- 자체 버튼
- 자체 아이콘
- 자체 간격
- 자체 광고 디자인

사용자가 보자마자 “한국식 갤러리 게시판”임을 이해하되 독립적인 사이트로 보여야 한다.

## 4.2 시각 원칙

- 흰색 기반
- 얇은 회색 구분선
- 짙은 남청색 포인트
- 높은 정보 밀도
- 모서리 라운딩 최소
- 타이포와 여백은 현대적으로 소폭 개선
- 카드형 SNS UI 금지
- 네온·홀로그램·과한 SF UI 금지
- 과도한 glassmorphism 금지

느낌:

> 20년 동안 운영되며 몇 차례 리뉴얼된 오래된 한국 커뮤니티.

---

# 5. PC 레이아웃

권장 최대 폭:

```text
1180~1280px
```

```text
┌─────────────────────────────────────────────────────────────┐
│ 대한민국 헌터 갤러리                      설정 | 이용안내   │
├─────────────────────────────────────────────────────────────┤
│ [대표 이미지] 갤러리 설명 / 개설 정보      │ [현재 광고]    │
│              관리자 / 관련 안내            │                │
├─────────────────────────────────────────────────────────────┤
│ [전체글] [개념글] [공지] [고전글]                           │
│ 일반 질문 정보 공략 사건 구인 길드 방송 협회               │
├─────────────────────────────────────────────────────────────┤
│ 번호 │ 말머리 │ 제목          │ 글쓴이 │ 작성일 │ 조회 │ 추천 │
│ ...                                                         │
├─────────────────────────────────────────────────────────────┤
│ 페이지네이션                                               │
│ [제목+본문 ▼] [검색____________________][검색]               │
└─────────────────────────────────────────────────────────────┘
```

---

# 6. 모바일 레이아웃

별도 모바일 앱이나 별도 데이터 구조를 만들지 않는다.

동일 React 컴포넌트를 CSS 반응형으로 재배치한다.

PC:

```text
번호 | 말머리 | 제목 | 글쓴이 | 작성일 | 조회 | 추천
```

모바일:

```text
[질문] B급 짐꾼 180이면 감? [7]
ㅇㅇ(39.7) · 23:50 · 조회 180 · 추천 1
```

모바일에서는 다음을 제목 아래 메타정보로 이동한다.

- 작성자
- 시간
- 조회
- 추천
- 댓글수

글 번호는 숨겨도 된다.

권장 브레이크포인트:

```css
--mobile: 600px;
--tablet: 900px;
--desktop: 1100px;
```

화면상 말머리는 모바일에서 가로 스크롤 가능하게 한다.

---

# 7. 상단 탭

고정:

```text
전체글 | 개념글 | 공지 | 고전글
```

### 전체글
기본 게시판 목록.

### 개념글

내부 정렬 기준:

```text
추천 × 2 + 댓글 수
```

공식은 사용자에게 공개하지 않는다.

### 공지
**2042년 현재 상단 고정공지 5개**를 표시한다.

### 고전글
과거 중요글·보존글·역사적 사건 접근용.

---

# 8. 내부 분류와 화면 말머리

## 8.1 내부 8분류

AI 생성·통계·아카이브 배치용.

```text
뻘글·잡담
질문·뉴비
공략·실무
갈드컵·랭킹
사건·속보
팬덤·방송
시장·구인
협회·법·범죄
```

화면에는 그대로 노출하지 않는다.

## 8.2 화면 9말머리

```text
일반
질문
정보
공략
사건
구인
길드
방송
협회
```

내부 분류와 화면 말머리는 독립적으로 저장한다.

예:

```json
{
  "internalCategory": "갈드컵·랭킹",
  "displayCategory": "길드"
}
```

---

# 9. 광고

## 9.1 광고 슬롯

```ts
type AdSlot =
  | "header-banner"
  | "right-sidebar"
  | "post-inline";
```

### header-banner
헤더 또는 탭 아래 가로 배너.

### right-sidebar
PC 우측 광고.

모바일에서는 숨기거나 인라인으로 재배치.

### post-inline
상세글 본문과 댓글 사이 광고.

한 화면에 최대 2~3개 정도만 보이게 한다.

팝업·전면광고는 사용하지 않는다.

## 9.2 광고 시대

광고는 항상 **2042년 9월 17일 현재 광고**다.

## 9.3 광고와 Canon 분리

광고 예시가 새로운 세계관 Canon을 무심코 만들지 않게 한다.

따라서 마스터 Canon에 없는 기존 조직의 계열사·자회사를 임의로 광고주로 만들지 않는다.

예를 들어 `백호손해보험`은 **백호가 보험업까지 한다는 새 Canon**이 될 수 있으므로 기본 광고 예시로 사용하지 않는다.

광고용 가상 회사 풀을 별도로 관리한다.

예:

```text
대영손해보험
한빛장비
오로라 마석정화
게이트워크
새벽모터스
온길통신
```

이 이름들은 광고 콘텐츠 제작 단계에서 별도 확정한다.

## 9.4 광고 업종 비율 권장

대략:

```text
헌터 산업 관련 55%
일반 소비재      45%
```

헌터 산업:

- 보험
- 장비 A/S
- 회복센터
- 마석 거래 플랫폼
- 길드 채용
- 운송·정화

일반 광고:

- 치킨
- 통신사
- 쇼핑
- 대학
- 게임
- 자동차
- 배달앱
- 여행

## 9.5 광고 데이터

`src/data/ads.json`

```json
{
  "id": "ad-2042-001",
  "slot": ["header-banner", "right-sidebar"],
  "brand": "대영손해보험",
  "headline": "게이트는 예고 없이 열립니다.",
  "image": "/assets/ads/daeyoung-insurance.webp",
  "active": true
}
```

---

# 10. 첨부파일

실제 지원:

```text
이미지만
```

게시글당 권장:

```text
0~4장
```

영상은 실제 재생하지 않는다.

표현:

- 영상 캡처
- 썸네일
- 프레임 캡처
- 기사 캡처

이미지 클릭 시 확대 모달.

오래된 이미지 유실:

```text
첨부 이미지를 불러올 수 없습니다.
```

---

# 11. 삭제글·삭제댓글

## 11.1 게시글 삭제 상태

```ts
type DeletedStatus =
  | null
  | "AUTHOR_DELETED"
  | "MODERATOR_DELETED"
  | "POLICY_DELETED"
  | "MISSING";
```

`ATTACHMENT_LOST`는 게시글 삭제 상태에서 제거한다.

첨부 유실은 attachment 객체 자체가 관리한다.

본문은 살아 있고 이미지 하나만 깨진 글도 정상적으로 표현 가능하다.

## 11.2 삭제글

목록에는 제목이 남을 수 있다.

클릭:

```text
작성자가 삭제한 게시글입니다.
```

또는:

```text
운영원칙 위반으로 삭제된 게시글입니다.
```

## 11.3 삭제댓글

원래 위치에:

```text
삭제된 댓글입니다.
```

삭제댓글에 달린 대댓글은 살아 있을 수 있다.

---

# 12. 헌갤콘 시스템

## 12.1 토큰 문법

데이터에서는 반드시:

```text
{{con:slug}}
```

형식을 사용한다.

사용 가능:

- 게시글 본문
- 댓글

사용 금지:

- 제목

댓글 하나당 권장:

```text
0~1개
```

최대:

```text
2개
```

## 12.2 별하나콘 — 현재 확정 16종

별하나 헌터콘은 **2035년 별하나 S급 각성·등록 이후 사용 가능**으로 고정한다.

정확한 token slug:

```text
{{con:hello}}
{{con:hi}}
{{con:hi_star}}
{{con:good}}
{{con:arrest}}
{{con:Intelligence}}
{{con:forwhat}}
{{con:sad}}
{{con:wait}}
{{con:stop}}
{{con:nothuman}}
{{con:dororong}}
{{con:kwah}}
{{con:heehee}}
{{con:real}}
{{con:idk}}
```

주의:

- `Intelligence`는 현재 확정 slug가 **대문자 I**로 시작한다.
- slug는 데이터에서 정확히 일치시킨다.
- 자동 소문자 변환을 하지 않는다.
- 파일명은 slug와 동일하게 맞추는 것을 권장한다.

권장 파일:

```text
public/assets/cons/byulhana/hello.webp
public/assets/cons/byulhana/hi.webp
public/assets/cons/byulhana/hi_star.webp
public/assets/cons/byulhana/good.webp
public/assets/cons/byulhana/arrest.webp
public/assets/cons/byulhana/Intelligence.webp
public/assets/cons/byulhana/forwhat.webp
public/assets/cons/byulhana/sad.webp
public/assets/cons/byulhana/wait.webp
public/assets/cons/byulhana/stop.webp
public/assets/cons/byulhana/nothuman.webp
public/assets/cons/byulhana/dororong.webp
public/assets/cons/byulhana/kwah.webp
public/assets/cons/byulhana/heehee.webp
public/assets/cons/byulhana/real.webp
public/assets/cons/byulhana/idk.webp
```

## 12.3 emoticons.json 권장 형태

```json
[
  {
    "slug": "hello",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/hello.webp",
    "alt": "별하나 hello 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "hi",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/hi.webp",
    "alt": "별하나 hi 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "hi_star",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/hi_star.webp",
    "alt": "별하나 hi_star 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "good",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/good.webp",
    "alt": "별하나 good 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "arrest",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/arrest.webp",
    "alt": "별하나 arrest 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "Intelligence",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/Intelligence.webp",
    "alt": "별하나 Intelligence 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "forwhat",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/forwhat.webp",
    "alt": "별하나 forwhat 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "sad",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/sad.webp",
    "alt": "별하나 sad 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "wait",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/wait.webp",
    "alt": "별하나 wait 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "stop",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/stop.webp",
    "alt": "별하나 stop 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "nothuman",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/nothuman.webp",
    "alt": "별하나 nothuman 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "dororong",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/dororong.webp",
    "alt": "별하나 dororong 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "kwah",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/kwah.webp",
    "alt": "별하나 kwah 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "heehee",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/heehee.webp",
    "alt": "별하나 heehee 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "real",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/real.webp",
    "alt": "별하나 real 콘",
    "availableFromYear": 2035
  },
  {
    "slug": "idk",
    "pack": "byulhana",
    "src": "/assets/cons/byulhana/idk.webp",
    "alt": "별하나 idk 콘",
    "availableFromYear": 2035
  }
]
```

## 12.4 렌더링

`dangerouslySetInnerHTML` 기반 치환 금지.

React 노드 기반 파싱.

```ts
const CON_TOKEN_REGEX = /\{\{con:([a-zA-Z0-9_-]+)\}\}/g;
```

등록되지 않은 slug는 원문 그대로 표시한다.

---

# 13. 검색

검색 범위:

```text
2022 ~ 2042.09.17
```

기본:

```text
제목+본문
```

선택:

```text
제목
제목+본문
작성자
댓글
```

정렬:

```text
최신순
오래된순
인기순
```

필터:

- 연도
- 화면 말머리

댓글 검색은 댓글 자체 URL을 반환하지 않는다.

검색어가 포함된 댓글이 달린 **원 게시글을 반환**하고 해당 댓글 일부를 미리보기로 보여줄 수 있다.

---

# 14. 작성자 데이터

익명:

```json
{
  "type": "anonymous",
  "name": "ㅇㅇ",
  "ip": "118.235"
}
```

고정닉:

```json
{
  "type": "fixed",
  "name": "짐꾼3년차",
  "ip": null
}
```

운영자:

```json
{
  "type": "admin",
  "name": "운영자",
  "ip": null
}
```

기본 비율:

- 익명 70%대
- 고정닉·직업닉·팬덤닉 나머지

댓글도 동일 규칙.

---

# 15. 마스터 데이터 전략

## 15.1 관리 원본

사용자가 관리하는 원본은 하나:

```text
source/
└─ hunter-gallery-master.json
```

이 파일에 현재 공지 5개와 1,200개 아카이브 게시글을 함께 저장한다.

## 15.2 마스터 JSON 최상위 — v1.1

```json
{
  "version": "1.1",
  "snapshot": "2042-09-17",
  "notices": [],
  "posts": []
}
```

의미:

- `notices`: **2042년 현재 상단 고정공지 5개**
- `posts`: 1,200개 아카이브
- 과거의 역사적 운영공지는 `posts` 안에 포함

현재 공지 5개는 1,200개에 포함하지 않는다.

---

# 16. Vite 생성 데이터 위치

## 16.1 필수 경로

빌드 스크립트의 출력 위치는 반드시:

```text
public/
└─ generated/
```

으로 한다.

전체 구조:

```text
public/
└─ generated/
   ├─ post-index.json
   ├─ search-index.json
   ├─ concept-index.json
   ├─ notices.json
   ├─ years/
   │  ├─ 2022.json
   │  ├─ 2023.json
   │  ├─ ...
   │  └─ 2042.json
   └─ posts/
      ├─ hg-2022-000001.json
      ├─ ...
      └─ hg-2042-001200.json
```

Vite build 후 자동으로:

```text
dist/generated/...
```

에 포함된다.

브라우저:

```ts
fetch("/generated/post-index.json");
```

## 16.2 데이터 준비

```bash
npm run data:prepare
```

과정:

1. 원본 JSON 검증
2. 현재 공지 분리
3. 게시글 인덱스 생성
4. 개별 게시글 파일 분리
5. 검색 인덱스 생성
6. 연도 인덱스 생성
7. 개념글 인덱스 생성

React는 `public/generated` 결과만 읽는다.

---

# 17. 게시글 객체

```json
{
  "id": "hg-2042-0917-0034",
  "displayNo": 2839412,
  "timestamp": "2042-09-17T11:42:18+09:00",

  "year": 2042,
  "era": "CURRENT",

  "internalCategory": "질문·뉴비",
  "displayCategory": "질문",

  "event": {
    "tag": null,
    "phase": "NONE",
    "related": false
  },

  "title": "B급 짐꾼 180이면 감?",

  "author": {
    "type": "anonymous",
    "name": "ㅇㅇ",
    "ip": "39.7"
  },

  "content": "오크 동굴이고 하루 예상\n장비는 파티에서 준다는데\n요즘 180이면 감?",

  "attachments": [],

  "stats": {
    "views": 392,
    "recommend": 8
  },

  "flags": {
    "notice": false,
    "concept": false,
    "classic": false,
    "deleted": false,
    "locked": false
  },

  "deletedStatus": null,

  "comments": [],

  "canon": {
    "keywords": ["짐꾼", "B급", "일당"],
    "forbiddenKnowledge": []
  }
}
```

---

# 18. `best` 대신 `concept` 사용

UI 용어가 **개념글**이므로 코드와 데이터도 `concept`로 통일한다.

사용:

```text
concept
concept-index.json
/concept
ConceptPage
```

사용하지 않음:

```text
best
best-index.json
/best
BestPage
```

---

# 19. 댓글 구조

댓글은 **flat array + parentId** 방식.

```json
{
  "id": "c-001",
  "parentId": null,
  "timestamp": "2042-09-17T11:43:02+09:00",

  "author": {
    "type": "anonymous",
    "name": "ㅇㅇ",
    "ip": "118.37"
  },

  "content": "180이면 요즘 그냥 평범함 {{con:good}}",
  "deleted": false
}
```

대댓글:

```json
{
  "id": "c-002",
  "parentId": "c-001",
  "timestamp": "2042-09-17T11:43:31+09:00",

  "author": {
    "type": "anonymous",
    "name": "ㅇㅇ",
    "ip": "39.7"
  },

  "content": "ㄱㅅ",
  "deleted": false
}
```

렌더 단계에서 댓글 트리로 변환한다.

---

# 20. 댓글 수는 원본에 중복 저장하지 않는다

원본 게시글에는:

```json
"stats": {
  "views": 392,
  "recommend": 8
}
```

만 둔다.

댓글 수:

```ts
const commentCount = post.comments.length;
```

개념글 인기점수도 빌드 인덱스에서 계산한다.

```ts
const popularityScore =
  post.stats.recommend * 2 + post.comments.length;
```

원본에 `commentCount`나 `popularityScore`를 중복 저장하지 않는다.

---

# 21. 첨부 이미지

정상:

```json
{
  "id": "att-01",
  "type": "image",
  "src": "/assets/posts/2042/hg-0917-0034-01.webp",
  "alt": "게이트 입구 사진",
  "status": "available"
}
```

유실:

```json
{
  "id": "att-01",
  "type": "image",
  "src": null,
  "alt": null,
  "status": "lost"
}
```

---

# 22. React 라우팅

고정 권장:

```text
/
/board
/post/:id
/search
/concept
/notices
/classic
```

선택:

```text
/year/:year
/category/:category
```

React Router 사용.

---

# 23. Cloudflare Pages SPA fallback

React Router의 직접 URL 접근과 새로고침을 지원하기 위해 반드시 추가한다.

파일:

```text
public/_redirects
```

내용:

```text
/* /index.html 200
```

이 파일은 Vite build 후 `dist/_redirects`로 복사된다.

이를 통해:

```text
/post/:id
/search
/concept
/classic
```

등을 직접 열거나 새로고침해도 SPA가 정상 진입한다.

---

# 24. React 컴포넌트 구조

```text
src/
├─ app/
│  ├─ App.tsx
│  ├─ router.tsx
│  └─ providers.tsx
│
├─ components/
│  ├─ layout/
│  │  ├─ SiteHeader.tsx
│  │  ├─ MainLayout.tsx
│  │  ├─ RightSidebar.tsx
│  │  └─ Footer.tsx
│  │
│  ├─ gallery/
│  │  ├─ GalleryHeader.tsx
│  │  ├─ GalleryMeta.tsx
│  │  ├─ GalleryTabs.tsx
│  │  └─ CategoryNav.tsx
│  │
│  ├─ board/
│  │  ├─ BoardTable.tsx
│  │  ├─ BoardRow.tsx
│  │  ├─ NoticeRow.tsx
│  │  ├─ DeletedRow.tsx
│  │  └─ Pagination.tsx
│  │
│  ├─ post/
│  │  ├─ PostHeader.tsx
│  │  ├─ PostBody.tsx
│  │  ├─ AttachmentGallery.tsx
│  │  ├─ ReactionButton.tsx
│  │  └─ PostMiniList.tsx
│  │
│  ├─ comments/
│  │  ├─ CommentList.tsx
│  │  ├─ CommentItem.tsx
│  │  ├─ CommentComposer.tsx
│  │  └─ DeletedComment.tsx
│  │
│  ├─ richtext/
│  │  ├─ RichTextRenderer.tsx
│  │  └─ HunterCon.tsx
│  │
│  ├─ ads/
│  │  ├─ AdSlot.tsx
│  │  ├─ HeaderBanner.tsx
│  │  ├─ SidebarAd.tsx
│  │  └─ PostInlineAd.tsx
│  │
│  ├─ search/
│  │  ├─ SearchBar.tsx
│  │  ├─ SearchFilters.tsx
│  │  └─ SearchResultRow.tsx
│  │
│  ├─ mutation/
│  │  ├─ MutationDialog.tsx
│  │  ├─ MutationToast.tsx
│  │  └─ MutationGuard.tsx
│  │
│  └─ common/
│     ├─ Modal.tsx
│     ├─ Button.tsx
│     └─ EmptyState.tsx
│
├─ pages/
│  ├─ BoardPage.tsx
│  ├─ PostPage.tsx
│  ├─ SearchPage.tsx
│  ├─ ConceptPage.tsx
│  ├─ NoticePage.tsx
│  └─ ClassicPage.tsx
│
├─ data/
│  ├─ galleryConfig.ts
│  ├─ ads.json
│  └─ emoticons.json
│
├─ lib/
│  ├─ dataLoader.ts
│  ├─ commentTree.ts
│  ├─ richTextParser.ts
│  ├─ search.ts
│  ├─ sorting.ts
│  ├─ pagination.ts
│  └─ date.ts
│
├─ hooks/
│  ├─ useBoardQuery.ts
│  ├─ useSearch.ts
│  └─ useMutationFailure.ts
│
├─ styles/
│  ├─ tokens.css
│  ├─ reset.css
│  ├─ global.css
│  └─ responsive.css
│
└─ types/
   ├─ post.ts
   ├─ comment.ts
   ├─ ad.ts
   └─ emoticon.ts
```

---

# 25. 데이터 빌드 스크립트

```text
scripts/
├─ build-data.ts
├─ validate-data.ts
├─ build-search-index.ts
├─ build-year-index.ts
└─ build-concept-index.ts
```

---

# 26. npm scripts — v1.1 필수안

새로 clone한 프로젝트에서 `npm run dev`만 실행해도 generated 데이터가 준비되어야 한다.

```json
{
  "scripts": {
    "data:validate": "tsx scripts/validate-data.ts",
    "data:build": "tsx scripts/build-data.ts",
    "data:prepare": "npm run data:validate && npm run data:build",

    "predev": "npm run data:prepare",
    "dev": "vite",

    "prebuild": "npm run data:prepare",
    "build": "vite",

    "preview": "vite preview"
  }
}
```

사용자는 보통:

```powershell
npm run dev
```

만 실행하면 된다.

---

# 27. 자동 검증

1,200개 이상 데이터를 수동 검수만으로 운영하지 않는다.

## 27.1 구조 검증

- post id 중복
- displayNo 중복
- comment id 중복
- 존재하지 않는 parentId
- 잘못된 author type
- title 누락
- timestamp 누락
- 잘못된 내부 분류
- 잘못된 화면 말머리
- 잘못된 attachment status
- 제목에 헌갤콘 사용
- 존재하지 않는 헌갤콘 slug
- 콘 시대 오류
- 공지 개수 오류
- 1,200개 posts 수량 오류

## 27.2 시간 검증

- 댓글이 게시글보다 과거
- 2042-09-17 T0 이후 게시물
- 사건 결과가 사건 이전 글에 등장
- 미래 용어 선행

## 27.3 Canon 검증

금지 정보 예:

- USER 특정 정보
- 《명성》
- 레드 게이트
- 송시안 진실
- 정하연 진실
- 강원 연쇄실종 실제 정답
- 미확정 미국 SS 상세정보
- 미확정 세부 법률

## 27.4 헌갤콘 시대 검증

```ts
if (post.year < emoticon.availableFromYear) {
  throw new Error(...);
}
```

예:

```text
ERROR
hg-2031-0032
Con "hello" is unavailable before 2035.
```

---

# 28. 검색 인덱스

빌드 시 생성:

```json
{
  "id": "hg-2042-0917-0034",
  "title": "B급 짐꾼 180이면 감?",
  "bodyText": "오크 동굴이고...",
  "authorText": "ㅇㅇ 39.7",
  "commentText": "180이면 요즘 그냥 평범함 ㄱㅅ",
  "year": 2042,
  "displayCategory": "질문",
  "timestamp": "2042-09-17T11:42:18+09:00",
  "popularityScore": 419
}
```

검색 인덱스는 검색 최적화를 위한 파생 데이터다.

원본 마스터에는 저장하지 않는다.

---

# 29. 페이지네이션

기본:

```text
페이지당 50개
```

PC:

```text
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
```

모바일:

```text
‹ 이전   3 / 15   다음 ›
```

전체 게시글이 정확히 1,200개라는 숫자를 사이트에 노출하지 않는다.

---

# 30. 글 번호

실제 배열 인덱스와 완전히 분리한다.

금지:

```text
1
2
...
1200
```

예:

```text
2839412
2839411
2839407
```

`displayNo`는 실제 20년 누적 커뮤니티 번호처럼 보이게 한다.

---

# 31. 상세글 페이지

```text
제목
작성자 / 날짜 / 조회 / 추천
────────────────
본문
첨부 이미지
────────────────
추천 버튼
────────────────
현재 광고
────────────────
댓글
댓글 입력창
────────────────
현재 페이지 게시글 미니 목록
```

글 아래 미니 목록을 두어 연속 탐색을 유도한다.

---

# 32. MutationGuard

```ts
type MutationAction =
  | "WRITE_POST"
  | "WRITE_COMMENT"
  | "RECOMMEND"
  | "REPORT"
  | "LOGIN"
  | "REGISTER";
```

오류 문구는 하나의 설정 객체에서 관리한다.

추천은 optimistic UI 후 rollback한다.

---

# 33. 디자인 토큰

권장 시작값:

```css
:root {
  --page-bg: #ffffff;
  --surface: #ffffff;
  --surface-soft: #f7f8fb;

  --line: #d9dde8;
  --line-strong: #8f9abe;

  --text: #171b28;
  --text-subtle: #6c7280;

  --brand: #283e86;
  --brand-strong: #1f326e;

  --danger: #b73535;

  --radius-sm: 3px;
  --radius-md: 5px;
}
```

실제 UI 구현 과정에서 조정한다.

---

# 34. 권장 기술 스택

필수:

```text
React
Vite
TypeScript
React Router
```

권장:

```text
Zod
```

용도:

- 마스터 JSON 스키마 검증
- 빌드타임 오류 차단

선택:

```text
Fuse.js
```

검색 고도화 시 사용.

초기 1,200개 규모에서는 자체 검색도 가능하다.

---

# 35. 초기 설치

```bash
npm create vite@latest hunter-gallery -- --template react-ts
npm install react-router-dom zod
npm install -D tsx
```

선택:

```bash
npm install fuse.js
```

---

# 36. public 디렉터리

```text
public/
├─ _redirects
│
├─ generated/
│  ├─ post-index.json
│  ├─ search-index.json
│  ├─ concept-index.json
│  ├─ notices.json
│  ├─ years/
│  └─ posts/
│
└─ assets/
   ├─ gallery/
   ├─ ads/
   ├─ cons/
   │  ├─ default/
   │  └─ byulhana/
   └─ posts/
      ├─ 2022/
      ├─ 2023/
      ├─ ...
      └─ 2042/
```

`public/generated`는 build-data 스크립트가 재생성한다.

---

# 37. 데이터 추가 작업 흐름

향후 1,200개 게시글 생성 완료 후:

1. `source/hunter-gallery-master.json`에 넣기
2. `npm run data:validate`
3. 오류 수정
4. `npm run data:build`
5. `npm run dev`
6. 브라우저 검수
7. Cloudflare Pages 배포

게시글을 1,500개, 2,000개로 늘려도 React UI 코드를 수정하지 않는다.

---

# 38. 접근성

최소 기준:

- 이미지 alt
- 헌갤콘 alt
- 키보드 탭 이동
- 모달 ESC 닫기
- 추천 버튼 aria-label
- 모바일 터치 영역 확보
- 지나치게 작은 글자 금지

게시판형 고밀도 UI이지만 가독성은 현재 웹 기준으로 개선한다.

---

# 39. 성능

전체 게시글·댓글을 첫 화면에 한 번에 로드하지 않는다.

권장:

- 목록: `/generated/post-index.json`
- 개별 글: `/generated/posts/:id.json`
- 검색: `/generated/search-index.json`
- 개념글: `/generated/concept-index.json`
- 공지: `/generated/notices.json`
- 이미지: lazy loading

초기 로딩을 가볍게 유지한다.

---

# 40. Cloudflare Pages 배포

정적 사이트로 배포 가능하다.

권장:

```text
Cloudflare Pages
```

필수:

```text
public/_redirects
```

내용:

```text
/* /index.html 200
```

서버 DB는 필요하지 않다.

이유:

- 실제 쓰기 없음
- 실제 인증 없음
- 추천 실제 저장 없음
- 댓글 실제 저장 없음
- 콘텐츠는 정적 JSON

---

# 41. 보안·프라이버시

연출용 로그인·댓글 UI가 실제 개인정보를 수집하지 않게 한다.

금지:

- 비밀번호 서버 전송
- 댓글 입력값 저장
- 추천 클릭 기록을 사용자 단위로 저장
- 회원가입 정보 저장

사용자가 입력한 값은 연출 후 폐기한다.

---

# 42. AI 대량 생성용 최소 게시글 템플릿

```json
{
  "id": "",
  "displayNo": 0,
  "timestamp": "",
  "year": 2042,

  "internalCategory": "",
  "displayCategory": "",

  "event": {
    "tag": null,
    "phase": "NONE",
    "related": false
  },

  "title": "",

  "author": {
    "type": "anonymous",
    "name": "ㅇㅇ",
    "ip": ""
  },

  "content": "",

  "attachments": [],

  "stats": {
    "views": 0,
    "recommend": 0
  },

  "flags": {
    "notice": false,
    "concept": false,
    "classic": false,
    "deleted": false,
    "locked": false
  },

  "deletedStatus": null,
  "comments": [],

  "canon": {
    "keywords": [],
    "forbiddenKnowledge": []
  }
}
```

---

# 43. AI 대량 생성용 댓글 템플릿

```json
{
  "id": "c-0001",
  "parentId": null,
  "timestamp": "2042-09-17T12:31:04+09:00",

  "author": {
    "type": "anonymous",
    "name": "ㅇㅇ",
    "ip": "118.235"
  },

  "content": "ㅋㅋㅋㅋ {{con:heehee}}",
  "deleted": false
}
```

대댓글은 `parentId`만 지정한다.

---

# 44. 구현 순서

## Phase 1 — 골격

- Vite 프로젝트 생성
- React Router
- 전역 스타일
- PC 게시판 목록
- 모바일 반응형 목록
- 더미 게시글 20개
- 현재 공지 5개 더미

## Phase 2 — 상세글

- 본문
- 이미지
- 댓글 트리
- 추천 버튼
- 미니 목록

## Phase 3 — 읽기/쓰기 규칙

- 댓글 입력
- 글쓰기
- 추천 +1 → rollback
- 신고
- 로그인
- 회원가입
- MutationGuard

## Phase 4 — 검색/아카이브

- 검색
- 연도 필터
- 말머리 필터
- 개념글
- 공지
- 고전글

## Phase 5 — 헌갤콘

- token parser
- 별하나콘 16종 등록
- `availableFromYear` validator
- 이미지 실제 연결

## Phase 6 — 광고

- 3개 슬롯
- 광고주 풀
- `ads.json`
- 모바일 재배치

## Phase 7 — 대량 데이터 파이프라인

- master JSON
- notices + posts 분리
- Zod schema
- validate-data
- build-data
- search index
- year index
- concept index

## Phase 8 — 실제 1,200개 투입

- Canon 검수
- 연대 검수
- AI 냄새 검사
- 이미지 연결
- 최종 QA

---

# 45. 구현 완료 기준

- [ ] PC/모바일 정상
- [ ] 전체글/개념글/공지/고전글 작동
- [ ] 현재 고정공지 5개 별도 관리
- [ ] 1,200개 이상 JSON 자동 로딩
- [ ] `public/generated` 자동 생성
- [ ] 개별 글 URL 직접접속/새로고침 정상
- [ ] Cloudflare `_redirects` 정상
- [ ] 댓글 트리 작동
- [ ] 댓글 수는 배열에서 계산
- [ ] 삭제글/삭제댓글 작동
- [ ] 첨부 유실과 게시글 삭제상태 분리
- [ ] 별하나콘 16종 작동
- [ ] 헌갤콘 연도 제한 검증
- [ ] 이미지 확대 작동
- [ ] 검색 4종 작동
- [ ] 최신/오래된/인기순 작동
- [ ] 연도/말머리 필터 작동
- [ ] 추천 +1 → rollback 연출
- [ ] 글쓰기 실패
- [ ] 댓글 등록 실패
- [ ] 신고 실패
- [ ] 로그인 실패
- [ ] 회원가입 실패
- [ ] 광고 3슬롯 작동
- [ ] 광고는 항상 2042 현재 광고
- [ ] 광고가 무심코 새로운 Canon을 만들지 않음
- [ ] 대한민국 최대 헌터 전문 익명 커뮤니티라는 체감 유지
- [ ] USER/명성/레드 게이트 사전 노출 없음
- [ ] 본편 시뮬레이션과 완전 분리

---

# 46. 최종 한 줄 설계

> **대한민국 헌터 갤러리는 2042년 기준 대한민국 최대 규모의 헌터 전문 익명 커뮤니티다. 한국식 고밀도 갤러리 게시판의 익숙한 구조를 독립적인 디자인으로 재해석하고, React + Vite 기반 단일 반응형 SPA로 PC와 모바일을 함께 지원한다. 사용자는 20년치 모든 기록을 읽고 검색할 수 있지만 글·댓글·추천·신고·계정처럼 저 세계에 영향을 남기는 요청은 origin 오류와 함께 실패한다. 현재 공지 5개와 1,200개 아카이브는 하나의 master JSON에서 관리되며, 빌드 시 public/generated 아래의 목록·개별글·검색·연도·개념글 인덱스로 자동 분해된다. 별하나콘을 포함한 헌갤콘과 광고 역시 데이터 기반으로 확장한다.**
