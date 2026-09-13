import { Link } from "react-router-dom";
import type { PostIndexItem } from "../../types/post";

export function PostMiniList({ rows, currentId }: { rows: PostIndexItem[]; currentId: string }) {
  if (!rows.length) return null;
  return <section className="post-mini-list">
    <div className="section-title">이 글 주변 목록</div>
    {rows.map((row) => <div key={row.id} className={`mini-row${row.id === currentId ? " current" : ""}`}>
      <span>{row.displayCategory}</span>
      {row.id === currentId ? <strong>{row.title}</strong> : <Link to={`/post/${row.id}`}>{row.title}</Link>}
      <em>[{row.commentCount}]</em>
    </div>)}
  </section>;
}
