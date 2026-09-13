import { galleryConfig } from "../../data/galleryConfig";
export function Footer() {
  return <footer id="footer" className="site-footer">
    <strong>{galleryConfig.fullName}</strong>
    <span> · 2042.09.17</span>
    <p>게시물과 댓글은 각 작성자의 의견입니다.</p>
  </footer>;
}
