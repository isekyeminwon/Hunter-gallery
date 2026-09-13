import { Link, useSearchParams } from "react-router-dom";
import { galleryConfig } from "../../data/galleryConfig";
export function CategoryNav() {
  const [params] = useSearchParams();
  const current = params.get("category");
  return <nav className="category-nav" aria-label="말머리 필터">
    <Link className={!current ? "active" : undefined} to="/board">전체</Link>
    {galleryConfig.categories.map((category) => (
      <Link key={category} className={current === category ? "active" : undefined} to={`/board?category=${encodeURIComponent(category)}`}>{category}</Link>
    ))}
  </nav>;
}
