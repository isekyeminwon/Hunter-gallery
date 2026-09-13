import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BoardTable } from "../components/board/BoardTable";
import { Pagination } from "../components/board/Pagination";
import { SearchBar } from "../components/search/SearchBar";
import { loadConceptIndex } from "../lib/dataLoader";
import { sortPosts, type SortMode } from "../lib/sorting";
import { paginate } from "../lib/pagination";
import { galleryConfig } from "../data/galleryConfig";
import type { PostIndexItem } from "../types/post";

export function ConceptPage() {
  const [rows, setRows] = useState<PostIndexItem[]>([]);
  const [params, setParams] = useSearchParams();
  const sort: SortMode = params.get("sort") === "popular" ? "popular" : "latest";
  const page = Number(params.get("page") || "1");
  useEffect(() => { loadConceptIndex().then(setRows); }, []);
  const sorted = useMemo(() => sortPosts(rows, sort), [rows, sort]);
  const result = paginate(sorted, page, galleryConfig.pageSize);

  const setSort = (nextSort: SortMode) => {
    const next = new URLSearchParams(params);
    if (nextSort === "latest") next.delete("sort"); else next.set("sort", nextSort);
    next.delete("page");
    setParams(next);
  };

  const goPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    if (nextPage <= 1) next.delete("page"); else next.set("page", String(nextPage));
    setParams(next);
  };

  return <>
    <div className="board-toolbar">
      <div className="board-status">개념글</div>
      <div className="sort-toggle">
        <button className={sort === "latest" ? "active" : undefined} onClick={() => setSort("latest")}>최신순</button>
        <button className={sort === "popular" ? "active" : undefined} onClick={() => setSort("popular")}>인기순</button>
      </div>
    </div>
    <BoardTable rows={result.rows} />
    <Pagination page={result.page} totalPages={result.totalPages} onPage={goPage} />
    <SearchBar />
  </>;
}
