# 대한민국 헌터 갤러리 — 구현 명세 v1.3 Final Hardening

기준 구현 버전: **v0.2.1**

이 문서는 1,200개 실제 콘텐츠 투입 직전 마지막 하드닝 규칙을 기록한다.

## 1. Final validator는 편성표 자체를 검증한다

`REQUIRE_FULL_DATASET=1`일 때 다음을 모두 exact count로 강제한다.

- 현재 고정공지: 5 (1,200 바깥)
- 아카이브 게시글: 1,200
- 개념글: 144
- 고전글: 72
- 삭제·유실: 18
- 역사적 운영공지: 12
- 내부 분류: `324 / 180 / 192 / 144 / 120 / 96 / 72 / 72`
- 연도별 게시글 수: 제작 마스터 표와 정확히 일치
- 연도 × 내부분류 매트릭스: 제작 마스터 표와 정확히 일치
- 삭제·유실 연도별 배치: 제작 마스터 표와 정확히 일치

모든 수량 규칙은 `scripts/archive-rules.ts`에서 관리한다.

## 2. 헌갤콘 시대 판정

- 게시글 본문: `post.year` 사용.
- 댓글: `comment.timestamp`의 연도 사용.

고전글에 수년 뒤 댓글이 달리는 것은 정상이다. 따라서 댓글의 콘을 게시글 연도로 검증하면 안 된다.

## 3. 역사적 운영공지

- 현재 고정공지 5개: `master.notices`.
- 역사적 운영공지 12개: `master.posts` 내부에서 `flags.notice=true`.
- 역사적 공지는 일반 아카이브 글 번호/날짜/댓글 구조를 유지한다.
- 목록에서는 제목 앞에 작은 `공지` 태그를 표시한다.

## 4. Canon guard

`scripts/forbidden-patterns.ts`에서 직접 노출이 명백한 비공개 Canon 변형을 정규식으로 검사한다.

정규식은 **보조 안전망**이다. 추측인지 사실 단정인지, 우회적인 의미 노출인지까지 완전히 판단할 수 없으므로 1,200개 완성 후 Canon 검수 AI/수동 검수를 별도로 수행한다.

## 5. 광고 이미지

이미지 파일:

```text
public/assets/ads/
```

데이터:

```text
src/data/ads.json
```

예:

```json
{
  "id": "ad-2042-005",
  "slot": ["header-banner"],
  "brand": "새벽모터스",
  "headline": "퇴근이 새벽이어도, 길은 남아 있습니다.",
  "subline": "2042 가을 전기차 프로모션",
  "image": "/assets/ads/saebyeok-motors-fall.webp",
  "active": true
}
```

`AdSlot.tsx`가 이미지가 있을 때 자동으로 렌더링한다.

## 6. 헌갤콘 추가

이미지 파일:

```text
public/assets/cons/<pack>/<slug>.webp
```

등록:

```text
src/data/emoticons.json
```

본문/댓글 토큰:

```text
{{con:slug}}
```

`availableFromYear`는 반드시 실제 등장 가능 연도에 맞춘다. slug는 대소문자를 구분한다.

## 7. pagination 입력 안전화

URL에서 `?page=abc`, `?page=Infinity`, 음수 등이 들어와도 `paginate()`가 안전하게 1페이지 범위로 정규화한다.

## 8. package-lock 마지막 처리

네트워크 가능한 개발 PC에서 최초 1회:

```powershell
npm install
git add package-lock.json
git commit -m "Lock transitive dependencies"
```

이후에는:

```powershell
npm ci
```

를 사용한다.
