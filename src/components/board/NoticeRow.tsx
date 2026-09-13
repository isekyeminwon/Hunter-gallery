import { Link } from "react-router-dom";
import type { PostIndexItem } from "../../types/post";
import { formatBoardDate } from "../../lib/date";

function AuthorLabel({ row }: { row: PostIndexItem }) {
  if (row.author.type === "anonymous") {
    return <>{row.author.name}<span className="author-ip">({row.author.ip})</span></>;
  }
  return <>{row.author.name}</>;
}

export function NoticeRow({ row }: { row: PostIndexItem }) {
  return (
    <article className="feed-item notice-row">
      <div className="feed-vote notice-vote" aria-hidden="true">
        <span className="notice-dot" />
        <strong>공지</strong>
      </div>
      <div className="feed-main">
        <div className="feed-title-line">
          <span className="category-badge">{row.displayCategory}</span>
          <Link className="feed-title" to={`/post/${row.id}`}>{row.title}</Link>
        </div>
        <div className="feed-meta">
          <span><AuthorLabel row={row} /></span>
          <span>{formatBoardDate(row.timestamp)}</span>
          <span>댓글 {row.commentCount.toLocaleString("ko-KR")}</span>
          <span>조회 {row.stats.views.toLocaleString("ko-KR")}</span>
        </div>
      </div>
    </article>
  );
}
