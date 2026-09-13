import { useEffect, useMemo, useState } from "react";
import { BoardTable } from "../components/board/BoardTable";
import { EmptyState } from "../components/common/EmptyState";
import { loadNotices, loadPostIndex } from "../lib/dataLoader";
import type { PostIndexItem } from "../types/post";

export function NoticePage() {
  const [current, setCurrent] = useState<PostIndexItem[]>([]);
  const [posts, setPosts] = useState<PostIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([loadNotices(), loadPostIndex()])
      .then(([noticeRows, postRows]) => {
        setCurrent(noticeRows);
        setPosts(postRows);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const historical = useMemo(
    () => posts.filter((row) => row.flags.notice).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [posts],
  );

  if (loading) return <div className="loading">공지를 불러오는 중...</div>;
  if (error) return <EmptyState>{error}</EmptyState>;

  return <>
    <div className="board-toolbar"><div className="board-status">공지</div><span className="snapshot-label">현재 고정공지</span></div>
    <BoardTable rows={[]} notices={current} />

    <div className="board-toolbar notice-archive-toolbar">
      <div className="board-status">과거 운영공지</div>
      <span className="snapshot-label">아카이브</span>
    </div>
    <BoardTable rows={historical} />
    {!historical.length && <EmptyState>샘플 데이터에는 과거 운영공지가 아직 없습니다.</EmptyState>}
  </>;
}
