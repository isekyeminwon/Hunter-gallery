import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { masterSchema } from "./schema";
import { FINAL_ARCHIVE_RULES, type ArchiveCategory } from "./archive-rules";
import { FORBIDDEN_PATTERNS } from "./forbidden-patterns";
import emoticons from "../src/data/emoticons.json" with { type: "json" };
import { galleryConfig } from "../src/data/galleryConfig";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const masterPath = path.join(root, "source", "hunter-gallery-master.json");

const raw = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const parsed = masterSchema.safeParse(raw);

if (!parsed.success) {
  console.error(parsed.error.issues);
  process.exit(1);
}

const master = parsed.data;
const errors: string[] = [];
const warnings: string[] = [];
const allPosts = [...master.notices, ...master.posts];
const finalMode = process.env.REQUIRE_FULL_DATASET === "1";

if (master.notices.length !== FINAL_ARCHIVE_RULES.currentNoticeCount) {
  errors.push(`현재 고정공지 수가 ${FINAL_ARCHIVE_RULES.currentNoticeCount}개가 아닙니다: ${master.notices.length}`);
}
if (master.notices.some((notice) => !notice.flags.notice)) {
  errors.push("현재 고정공지 notices 배열에는 flags.notice=false 항목이 있으면 안 됩니다.");
}
if (master.posts.length < 20) errors.push(`프로토타입 게시글이 20개 미만입니다: ${master.posts.length}`);
if (!finalMode && master.posts.length !== FINAL_ARCHIVE_RULES.postCount) {
  warnings.push(`현재 아카이브는 ${master.posts.length}개입니다. 최종본 목표는 ${FINAL_ARCHIVE_RULES.postCount.toLocaleString("ko-KR")}개입니다.`);
  warnings.push("정확 편성표 검증은 REQUIRE_FULL_DATASET=1에서 강제됩니다.");
}

const postIds = new Set<string>();
const displayNos = new Set<number>();
const globalCommentIds = new Set<string>();
const tokenRegex = /\{\{con:([a-zA-Z0-9_-]+)\}\}/g;
const emoticonMap = new Map(emoticons.map((item) => [item.slug, item]));
const cutoff = new Date(galleryConfig.archiveCutoff).getTime();

function validateCommentGraph(postId: string, comments: typeof allPosts[number]["comments"]) {
  const byId = new Map(comments.map((comment) => [comment.id, comment]));
  const localIds = new Set<string>();

  for (const comment of comments) {
    if (localIds.has(comment.id)) errors.push(`게시글 내 중복 comment id: ${postId}/${comment.id}`);
    localIds.add(comment.id);

    if (globalCommentIds.has(comment.id)) errors.push(`전체 중복 comment id: ${comment.id}`);
    globalCommentIds.add(comment.id);

    if (comment.parentId === comment.id) errors.push(`댓글이 자기 자신을 parent로 가리킴: ${postId}/${comment.id}`);
    if (comment.parentId && !byId.has(comment.parentId)) errors.push(`존재하지 않는 parentId: ${postId}/${comment.id}`);

    if (comment.parentId) {
      const parent = byId.get(comment.parentId);
      if (parent && new Date(parent.timestamp).getTime() > new Date(comment.timestamp).getTime()) {
        errors.push(`대댓글이 부모 댓글보다 과거: ${postId}/${comment.id}`);
      }
    }
  }

  for (const comment of comments) {
    const seen = new Set<string>();
    let cursor: typeof comment | undefined = comment;
    while (cursor?.parentId) {
      if (seen.has(cursor.id)) {
        errors.push(`댓글 parent cycle: ${postId}/${comment.id}`);
        break;
      }
      seen.add(cursor.id);
      cursor = byId.get(cursor.parentId);
    }
  }
}

function validateConTokens(text: string, contentYear: number, context: string) {
  tokenRegex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(text))) {
    const emoticon = emoticonMap.get(match[1]);
    if (!emoticon) {
      errors.push(`존재하지 않는 헌갤콘 '${match[1]}': ${context}`);
      continue;
    }
    if (contentYear < emoticon.availableFromYear) {
      errors.push(`헌갤콘 시대 오류 '${match[1]}' (${emoticon.availableFromYear} 이전): ${context} / contentYear=${contentYear}`);
    }
  }
}

function validateForbiddenPatterns(post: typeof allPosts[number]) {
  const surfaces = [
    { label: "title", text: post.title },
    { label: "content", text: post.content },
    ...post.comments.map((comment) => ({ label: `comment:${comment.id}`, text: comment.content })),
  ];

  for (const surface of surfaces) {
    for (const rule of FORBIDDEN_PATTERNS) {
      if (rule.pattern.test(surface.text)) {
        errors.push(`금지 Canon 패턴 ${rule.id} (${rule.description}) 노출: ${post.id}/${surface.label}`);
      }
    }
  }
}

function assertExact(label: string, actual: number, expected: number) {
  if (actual !== expected) errors.push(`${label} 수량 불일치: actual=${actual}, expected=${expected}`);
}

function hasLostAttachment(post: typeof allPosts[number]) {
  return post.attachments.some((attachment) => attachment.status === "lost");
}

function isArchiveLoss(post: typeof allPosts[number]) {
  return post.flags.deleted || hasLostAttachment(post);
}

function period2042(timestamp: string) {
  const month = Number(timestamp.slice(5, 7));
  const day = Number(timestamp.slice(8, 10));
  if (month <= 2) return "janFeb" as const;
  if (month <= 4) return "marApr" as const;
  if (month <= 6) return "mayJun" as const;
  if (month <= 8) return "julAug" as const;
  if (month === 9 && day <= 16) return "sep01to16" as const;
  if (month === 9 && day === 17) return "sep17" as const;
  return null;
}

function validateFinalArchiveComposition() {
  const posts = master.posts;
  assertExact("아카이브 posts", posts.length, FINAL_ARCHIVE_RULES.postCount);
  assertExact("개념글", posts.filter((post) => post.flags.concept).length, FINAL_ARCHIVE_RULES.conceptCount);
  assertExact("고전글", posts.filter((post) => post.flags.classic).length, FINAL_ARCHIVE_RULES.classicCount);
  assertExact("삭제·유실 아카이브", posts.filter(isArchiveLoss).length, FINAL_ARCHIVE_RULES.archiveLossCount);
  assertExact("완전 삭제/소실", posts.filter((post) => post.flags.deleted).length, FINAL_ARCHIVE_RULES.actualDeletedCount);
  assertExact(
    "첨부 유실 중심 반쯤 유실",
    posts.filter((post) => !post.flags.deleted && hasLostAttachment(post)).length,
    FINAL_ARCHIVE_RULES.partialAttachmentLossCount,
  );
  assertExact("역사적 운영공지", posts.filter((post) => post.flags.notice).length, FINAL_ARCHIVE_RULES.historicalNoticeCount);

  for (const [category, expected] of Object.entries(FINAL_ARCHIVE_RULES.categoryTotals) as [ArchiveCategory, number][]) {
    const actual = posts.filter((post) => post.internalCategory === category).length;
    assertExact(`내부 분류 '${category}'`, actual, expected);
  }

  for (const [yearText, expected] of Object.entries(FINAL_ARCHIVE_RULES.yearTotals)) {
    const year = Number(yearText);
    const actual = posts.filter((post) => post.year === year).length;
    assertExact(`${year}년 전체`, actual, expected);
  }

  for (const [yearText, expected] of Object.entries(FINAL_ARCHIVE_RULES.archiveLossByYear)) {
    const year = Number(yearText);
    const actual = posts.filter((post) => post.year === year && isArchiveLoss(post)).length;
    assertExact(`${year}년 삭제·유실`, actual, expected);
  }

  const posts2042 = posts.filter((post) => post.year === 2042);
  for (const [period, expected] of Object.entries(FINAL_ARCHIVE_RULES.year2042PeriodTotals)) {
    const actual = posts2042.filter((post) => period2042(post.timestamp) === period).length;
    assertExact(`2042년 기간 '${period}'`, actual, expected);
  }
  const invalid2042Period = posts2042.filter((post) => period2042(post.timestamp) === null);
  if (invalid2042Period.length) {
    errors.push(`2042년 허용 구간 밖 게시글: ${invalid2042Period.map((post) => post.id).join(", ")}`);
  }

  if (galleryConfig.archiveCutoffStatus === "FINAL_T0") {
    const sep17Posts = posts2042
      .filter((post) => period2042(post.timestamp) === "sep17")
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const last = sep17Posts.at(-1);
    if (!last) {
      errors.push("FINAL_T0 모드인데 2042-09-17 게시글이 없습니다.");
    } else {
      const gapMs = cutoff - new Date(last.timestamp).getTime();
      const oneMinute = 60 * 1000;
      if (gapMs < oneMinute || gapMs > 10 * oneMinute) {
        errors.push(`2042-09-17 마지막 글이 T0 1~10분 전이 아님: ${last.id}, gapMinutes=${(gapMs / oneMinute).toFixed(2)}`);
      }
    }
  }

  for (const [yearText, row] of Object.entries(FINAL_ARCHIVE_RULES.yearCategoryMatrix)) {
    const year = Number(yearText);
    for (const [category, expected] of Object.entries(row) as [ArchiveCategory, number][]) {
      const actual = posts.filter((post) => post.year === year && post.internalCategory === category).length;
      assertExact(`${year}년 × '${category}'`, actual, expected);
    }
  }
}

for (const post of allPosts) {
  if (postIds.has(post.id)) errors.push(`중복 post id: ${post.id}`);
  postIds.add(post.id);
  if (displayNos.has(post.displayNo)) errors.push(`중복 displayNo: ${post.displayNo}`);
  displayNos.add(post.displayNo);

  const postTime = new Date(post.timestamp).getTime();
  if (post.year !== Number(post.timestamp.slice(0, 4))) errors.push(`year/timestamp 불일치: ${post.id}`);
  if (postTime >= cutoff) errors.push(`archiveCutoff 이후 게시글: ${post.id}`);
  if (/\{\{con:/.test(post.title)) errors.push(`제목에 헌갤콘 토큰 사용: ${post.id}`);
  if (post.flags.deleted !== Boolean(post.deletedStatus)) {
    errors.push(`flags.deleted / deletedStatus 불일치: ${post.id}`);
  }
  if (post.flags.deleted && post.content.trim() !== "") {
    errors.push(`삭제글 본문은 source에서도 비워야 합니다: ${post.id}`);
  }
  for (const comment of post.comments) {
    if (comment.deleted && comment.content.trim() !== "") {
      errors.push(`삭제댓글 content는 빈 문자열이어야 합니다: ${post.id}/${comment.id}`);
    }
  }

  validateForbiddenPatterns(post);
  validateCommentGraph(post.id, post.comments);
  validateConTokens(post.content, post.year, `${post.id}/content`);

  for (const comment of post.comments) {
    const commentTime = new Date(comment.timestamp).getTime();
    if (commentTime < postTime) errors.push(`게시글보다 과거 댓글: ${post.id}/${comment.id}`);
    if (commentTime >= cutoff) errors.push(`archiveCutoff 이후 댓글: ${post.id}/${comment.id}`);

    // 고전글 성지순례 댓글은 게시글 작성연도가 아니라 댓글 자체의 작성연도로 콘 시대를 판정한다.
    const commentYear = Number(comment.timestamp.slice(0, 4));
    validateConTokens(comment.content, commentYear, `${post.id}/${comment.id}`);
  }
}

if (finalMode) validateFinalArchiveComposition();

if (galleryConfig.archiveCutoffStatus !== "FINAL_T0") {
  warnings.push(`archiveCutoff는 아직 임시값입니다: ${galleryConfig.archiveCutoff} (${galleryConfig.archiveCutoffStatus})`);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`OK: notices=${master.notices.length}, posts=${master.posts.length}, comments=${globalCommentIds.size}, validation passed${finalMode ? " (FINAL composition enforced)" : ""}`);
