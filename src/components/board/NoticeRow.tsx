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
  return <tr className="notice-row">
    <td className="col-no"><span className="notice-pill">공지</span></td>
    <td className="col-category">{row.displayCategory}</td>
    <td className="col-title"><Link to={`/post/${row.id}`}>{row.title}</Link></td>
    <td className="col-author"><AuthorLabel row={row} /></td>
    <td className="col-date">{formatBoardDate(row.timestamp)}</td>
    <td className="col-views">{row.stats.views.toLocaleString("ko-KR")}</td>
    <td className="col-recommend">{row.stats.recommend ? row.stats.recommend.toLocaleString("ko-KR") : "-"}</td>
  </tr>;
}
