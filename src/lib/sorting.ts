import type { PostIndexItem } from "../types/post";
export type SortMode = "latest" | "oldest" | "popular";
export function sortPosts<T extends PostIndexItem>(rows: T[], mode: SortMode): T[] {
  return [...rows].sort((a, b) => {
    if (mode === "popular") return b.popularityScore - a.popularityScore || b.stats.views - a.stats.views;
    if (mode === "oldest") return a.timestamp.localeCompare(b.timestamp);
    return b.timestamp.localeCompare(a.timestamp);
  });
}
