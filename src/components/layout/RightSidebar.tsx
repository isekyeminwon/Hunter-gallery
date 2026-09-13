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
    <section className="rail-section trending-section">
      <div className="rail-heading">
        <strong>실시간 많이 본 글</strong>
        <span>최근 7일</span>
      </div>
      {trending.length ? <ol className="trending-list">
        {trending.map((row, index) => <li key={row.id}>
          <span className="trend-rank">{index + 1}</span>
          <Link to={`/post/${row.id}`}>{row.title}</Link>
          <small>{row.stats.views.toLocaleString("ko-KR")}</small>
        </li>)}
      </ol> : <div className="side-box-empty">집계 중</div>}
    </section>

    <SidebarAd />

    <section className="rail-section rail-guide">
      <div className="rail-heading"><strong>처음 오셨나요?</strong></div>
      <div className="rail-guide-item"><span>01</span><div><strong>이용 안내</strong><p>커뮤니티 이용 수칙을 확인하세요.</p></div></div>
      <div className="rail-guide-item"><span>02</span><div><strong>정보는 교차 확인</strong><p>익명 게시물은 공식 안내가 아닙니다.</p></div></div>
      <div className="rail-guide-item"><span>03</span><div><strong>현장 안전 우선</strong><p>게이트 통제 정보는 관계기관 안내를 따르세요.</p></div></div>
    </section>
  </aside>;
}
