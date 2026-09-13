import { Link } from "react-router-dom";
import type { PostIndexItem } from "../../types/post";
import { formatBoardDate } from "../../lib/date";

function AuthorLabel({ row }: { row: PostIndexItem }) {
  if (row.author.type === "anonymous") return <>{row.author.name}<span className="author-ip">({row.author.ip})</span></>;
  return <>{row.author.name}</>;
}

export function BoardRow({ row }: { row: PostIndexItem }) {
  const rowClassName = [
    row.flags.concept ? "concept-row" : "",
    row.flags.notice ? "historical-notice-row" : "",
  ].filter(Boolean).join(" ") || undefined;

  return (
    <tr className={rowClassName}>
      <td className="col-no">{row.displayNoLabel ?? row.displayNo}</td>
      <td className="col-category"><span className="category-badge">{row.displayCategory}</span></td>
      <td className="col-title">
        <Link to={`/post/${row.id}`}>
          {row.flags.notice && <span className="tiny-tag notice">공지</span>}
          {row.flags.classic && <span className="tiny-tag classic">고전</span>}
          {row.flags.concept && <span className="tiny-tag concept">개념</span>}
          {row.title}
          {row.commentCount > 0 && <span className="comment-count"> [{row.commentCount}]</span>}
        </Link>
      </td>
      <td className="col-author"><AuthorLabel row={row} /></td>
      <td className="col-date">{formatBoardDate(row.timestamp)}</td>
      <td className="col-views">{row.stats.views.toLocaleString("ko-KR")}</td>
      <td className="col-recommend">{row.stats.recommend.toLocaleString("ko-KR")}</td>
    </tr>
  );
}
