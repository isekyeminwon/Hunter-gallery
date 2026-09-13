import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { masterSchema } from "./schema";
import { galleryConfig } from "../src/data/galleryConfig";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const masterPath = path.join(root, "source", "hunter-gallery-master.json");
const outRoot = path.join(root, "public", "generated");
const postsDir = path.join(outRoot, "posts");
const yearsDir = path.join(outRoot, "years");

const master = masterSchema.parse(JSON.parse(fs.readFileSync(masterPath, "utf8")));

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(postsDir, { recursive: true });
fs.mkdirSync(yearsDir, { recursive: true });

const toIndex = (post: (typeof master.posts)[number]) => ({
  id: post.id,
  displayNo: post.displayNo,
  displayNoLabel: post.displayNoLabel,
  timestamp: post.timestamp,
  year: post.year,
  internalCategory: post.internalCategory,
  displayCategory: post.displayCategory,
  title: post.title,
  author: post.author,
  stats: post.stats,
  flags: post.flags,
  deletedStatus: post.deletedStatus,
  commentCount: post.comments.length,
  popularityScore: post.stats.recommend * 2 + post.comments.length,
});

const postIndex = master.posts.map(toIndex).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
const CON_TOKEN_REGEX = /\{\{con:([a-zA-Z0-9_-]+)\}\}/g;

function toSearchText(text: string) {
  return text.replace(CON_TOKEN_REGEX, " [콘] ").replace(/\s+/g, " ").trim();
}

function sanitizePostForPublic(post: (typeof master.posts)[number]) {
  const deletedThread = post.flags.deleted || Boolean(post.deletedStatus);
  return {
    ...post,
    // source 전용 Canon QA 메타데이터는 public JSON에서 제거한다.
    canon: { keywords: [], forbiddenKnowledge: [] },
    content: deletedThread ? "" : post.content,
    attachments: deletedThread ? [] : post.attachments,
    comments: deletedThread
      ? []
      : post.comments.map((comment) => ({
          ...comment,
          content: comment.deleted ? "" : comment.content,
        })),
  };
}

const searchIndex = master.posts.map((post) => ({
  ...toIndex(post),
  bodyText: post.flags.deleted ? "" : toSearchText(post.content),
  authorText: `${post.author.name} ${post.author.ip ?? ""}`.trim(),
  commentText: post.flags.deleted
    ? ""
    : toSearchText(post.comments.filter((comment) => !comment.deleted).map((comment) => comment.content).join(" ")),
}));
const conceptIndex = postIndex.filter((post) => post.flags.concept);

const cutoffMs = new Date(galleryConfig.archiveCutoff).getTime();
const trendingStartMs = cutoffMs - galleryConfig.trendingWindowDays * 24 * 60 * 60 * 1000;
const trendingIndex = postIndex
  .filter((post) => {
    const timestamp = new Date(post.timestamp).getTime();
    return !post.flags.deleted && timestamp < cutoffMs && timestamp >= trendingStartMs;
  })
  .sort((a, b) => b.stats.views - a.stats.views || b.popularityScore - a.popularityScore || b.timestamp.localeCompare(a.timestamp))
  .slice(0, galleryConfig.trendingLimit);

for (const post of [...master.notices, ...master.posts]) {
  const publicPost = sanitizePostForPublic(post);
  fs.writeFileSync(path.join(postsDir, `${post.id}.json`), JSON.stringify(publicPost, null, 2));
}

for (let year = 2022; year <= 2042; year += 1) {
  const yearRows = postIndex.filter((post) => post.year === year);
  fs.writeFileSync(path.join(yearsDir, `${year}.json`), JSON.stringify(yearRows, null, 2));
}

fs.writeFileSync(path.join(outRoot, "post-index.json"), JSON.stringify(postIndex, null, 2));
fs.writeFileSync(path.join(outRoot, "search-index.json"), JSON.stringify(searchIndex, null, 2));
fs.writeFileSync(path.join(outRoot, "concept-index.json"), JSON.stringify(conceptIndex, null, 2));
fs.writeFileSync(path.join(outRoot, "trending-index.json"), JSON.stringify(trendingIndex, null, 2));
fs.writeFileSync(path.join(outRoot, "notices.json"), JSON.stringify(master.notices.map(toIndex), null, 2));

console.log(`Built public/generated: posts=${master.posts.length}, concepts=${conceptIndex.length}, trending=${trendingIndex.length}`);
