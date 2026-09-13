import { Link } from "react-router-dom";
import type { PostIndexItem } from "../../types/post";
import { formatBoardDate } from "../../lib/date";

function AuthorLabel({ row }: { row: PostIndexItem }) {
  if (row.author.type === "anonymous") {
    return <>{row.author.name}<span className="author-ip">({row.author.ip})</span></>;
  }
  return <>{row.author.name}</>;
}

export function BoardRow({ row }: { row: PostIndexItem }) {
  const className = [
    "feed-item",
    row.flags.concept ? "concept-row" : "",
    row.flags.notice ? "historical-notice-row" : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={className}>
      <div className="feed-vote" aria-label={`추천 ${row.stats.recommend}`}>
        <span className="feed-vote-icon">▲</span>
        <strong>{row.stats.recommend.toLocaleString("ko-KR")}</strong>
      </div>

      <div className="feed-main">
        <div className="feed-title-line">
          <span className={`category-badge category-${row.displayCategory}`}>{row.displayCategory}</span>
          {row.flags.notice && <span className="tiny-tag notice">공지</span>}
          {row.flags.classic && <span className="tiny-tag classic">고전</span>}
          {row.flags.concept && <span className="tiny-tag concept">개념</span>}
          <Link className="feed-title" to={`/post/${row.id}`}>{row.title}</Link>
        </div>

        <div className="feed-meta">
          <span><AuthorLabel row={row} /></span>
          <span>{formatBoardDate(row.timestamp)}</span>
          <span>댓글 {row.commentCount.toLocaleString("ko-KR")}</span>
          <span>조회 {row.stats.views.toLocaleString("ko-KR")}</span>
          {row.displayNoLabel && <span>{row.displayNoLabel}</span>}
        </div>
      </div>
    </article>
  );
}
