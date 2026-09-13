import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SidebarAd } from "../ads/SidebarAd";
import { loadTrendingIndex } from "../../lib/dataLoader";
import type { PostIndexItem } from "../../types/post";

export function RightSidebar() {
  const [trending, setTrending] = useState<PostIndexItem[]>([]);

  useEffect(() => {
    loadTrendingIndex().then(setTrending).catch(() => setTrending([]));
  }, []);

  return <aside className="right-sidebar">
    <SidebarAd />
    <div className="side-box">
      <div className="side-box-title">실시간 많이 본 글</div>
      {trending.length ? <ol>
        {trending.map((row) => <li key={row.id}><Link to={`/post/${row.id}`}>{row.title}</Link></li>)}
      </ol> : <div className="side-box-empty">집계 중</div>}
    </div>
  </aside>;
}
