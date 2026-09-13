import type { PostIndexItem } from "../../types/post";
import { BoardRow } from "./BoardRow";
import { NoticeRow } from "./NoticeRow";

export function BoardTable({ rows, notices = [] }: { rows: PostIndexItem[]; notices?: PostIndexItem[] }) {
  return (
    <section className="board-feed" aria-label="게시글 목록">
      {notices.length > 0 && (
        <div className="pinned-feed" aria-label="고정 공지">
          {notices.map((row) => <NoticeRow key={row.id} row={row} />)}
        </div>
      )}
      <div className="thread-feed">
        {rows.map((row) => <BoardRow key={row.id} row={row} />)}
      </div>
    </section>
  );
}
