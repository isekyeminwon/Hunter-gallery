import type { SearchIndexItem } from "../types/post";

export type SearchScope = "title" | "titleBody" | "author" | "comments";

export function searchRows(rows: SearchIndexItem[], query: string, scope: SearchScope) {
  const q = query.trim().toLocaleLowerCase("ko-KR");
  if (!q) return [];
  return rows.filter((row) => {
    const hay = scope === "title" ? row.title
      : scope === "author" ? row.authorText
      : scope === "comments" ? row.commentText
      : `${row.title} ${row.bodyText}`;
    return hay.toLocaleLowerCase("ko-KR").includes(q);
  });
}
