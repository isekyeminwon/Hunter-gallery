import type { PostIndexItem } from "../../types/post";
import { BoardRow } from "./BoardRow";
import { NoticeRow } from "./NoticeRow";

export function BoardTable({ rows, notices = [] }: { rows: PostIndexItem[]; notices?: PostIndexItem[] }) {
  return <div className="board-table-wrap">
    <table className="board-table">
      <thead><tr>
        <th className="col-no">번호</th><th className="col-category">말머리</th><th className="col-title">제목</th><th className="col-author">글쓴이</th><th className="col-date">작성일</th><th className="col-views">조회</th><th className="col-recommend">추천</th>
      </tr></thead>
      <tbody>
        {notices.map((row) => <NoticeRow key={row.id} row={row} />)}
        {rows.map((row) => <BoardRow key={row.id} row={row} />)}
      </tbody>
    </table>
  </div>;
}
