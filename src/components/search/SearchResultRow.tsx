import type { SearchIndexItem } from "../../types/post";
import { Link } from "react-router-dom";
import { formatFullDate } from "../../lib/date";
export function SearchResultRow({ row, query, scope }: { row: SearchIndexItem; query: string; scope: string }) {
  let preview = row.bodyText;
  if (scope === "comments") preview = row.commentText;
  const idx = preview.toLocaleLowerCase("ko-KR").indexOf(query.toLocaleLowerCase("ko-KR"));
  const clipped = idx >= 0 ? preview.slice(Math.max(0, idx - 38), idx + query.length + 70) : preview.slice(0, 120);
  return <article className="search-result">
    <div className="search-result-top"><span className="category-badge">{row.displayCategory}</span>{row.flags.notice && <span className="tiny-tag notice">공지</span>}<Link to={`/post/${row.id}`}>{row.title}</Link><span className="comment-count"> [{row.commentCount}]</span></div>
    <p>{clipped || "내용 없음"}</p>
    <div className="search-result-meta">{row.author.name}{row.author.ip ? `(${row.author.ip})` : ""} · {formatFullDate(row.timestamp)} · 조회 {row.stats.views.toLocaleString()} · 추천 {row.stats.recommend.toLocaleString()}</div>
  </article>;
}
