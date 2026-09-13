import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BoardTable } from "../components/board/BoardTable";
import { Pagination } from "../components/board/Pagination";
import { SearchBar } from "../components/search/SearchBar";
import { loadPostIndex } from "../lib/dataLoader";
import { paginate } from "../lib/pagination";
import { galleryConfig } from "../data/galleryConfig";
import type { PostIndexItem } from "../types/post";

export function ClassicPage() {
  const [rows, setRows] = useState<PostIndexItem[]>([]);
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || "1");
  useEffect(() => { loadPostIndex().then((data) => setRows(data.filter((row) => row.flags.classic))); }, []);
  const result = paginate(rows, page, galleryConfig.pageSize);

  const goPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    if (nextPage <= 1) next.delete("page"); else next.set("page", String(nextPage));
    setParams(next);
  };

  return <>
    <div className="board-toolbar"><div className="board-status">고전글</div><span className="snapshot-label">오래된 성지·사건·밈</span></div>
    <BoardTable rows={result.rows} />
    <Pagination page={result.page} totalPages={result.totalPages} onPage={goPage} />
    <SearchBar />
  </>;
}
