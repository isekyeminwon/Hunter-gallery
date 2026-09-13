import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BoardTable } from "../components/board/BoardTable";
import { Pagination } from "../components/board/Pagination";
import { SearchBar } from "../components/search/SearchBar";
import { loadNotices, loadPostIndex, loadYear } from "../lib/dataLoader";
import { paginate } from "../lib/pagination";
import type { DisplayCategory, PostIndexItem } from "../types/post";
import { galleryConfig } from "../data/galleryConfig";
import { EmptyState } from "../components/common/EmptyState";

export function BoardPage() {
  const [params, setParams] = useSearchParams();
  const route = useParams();
  const [rows, setRows] = useState<PostIndexItem[]>([]);
  const [notices, setNotices] = useState<PostIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const category = params.get("category") as DisplayCategory | null;
  const page = Number(params.get("page") || "1");

  useEffect(() => {
    setLoading(true);
    const loader = route.year ? loadYear(Number(route.year)) : loadPostIndex();
    Promise.all([loader, loadNotices()])
      .then(([posts, noticeRows]) => { setRows(posts); setNotices(noticeRows); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [route.year]);

  const filtered = useMemo(() => category ? rows.filter((row) => row.displayCategory === category) : rows, [rows, category]);
  const result = paginate(filtered, page, galleryConfig.pageSize);

  const goPage = (next: number) => {
    const nextParams = new URLSearchParams(params);
    if (next <= 1) nextParams.delete("page"); else nextParams.set("page", String(next));
    setParams(nextParams);
  };

  if (loading) return <div className="loading">게시글을 불러오는 중...</div>;
  if (error) return <EmptyState>{error}</EmptyState>;

  return <>
    <div className="board-toolbar">
      <div className="board-status">{route.year ? `${route.year}년 게시글` : category ? `${category} 말머리` : "전체글"}</div>
      <span className="snapshot-label">2042.09.17 현재</span>
    </div>
    <BoardTable rows={result.rows} notices={page === 1 && !route.year ? notices : []} />
    {!result.rows.length && <EmptyState>조건에 맞는 게시글이 없습니다.</EmptyState>}
    <Pagination page={result.page} totalPages={result.totalPages} onPage={goPage} />
    <SearchBar />
  </>;
}
