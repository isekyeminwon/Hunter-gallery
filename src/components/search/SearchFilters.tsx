import { galleryConfig } from "../../data/galleryConfig";
import type { SortMode } from "../../lib/sorting";
import type { DisplayCategory } from "../../types/post";

interface SearchFiltersProps {
  sort: SortMode;
  year: number | null;
  category: DisplayCategory | null;
  onSort: (sort: SortMode) => void;
  onYear: (year: number | null) => void;
  onCategory: (category: DisplayCategory | null) => void;
}

export function SearchFilters({ sort, year, category, onSort, onYear, onCategory }: SearchFiltersProps) {
  const years = Array.from({ length: 21 }, (_, index) => 2042 - index);
  return <div className="search-filters search-filters-expanded">
    <label>
      <span>연도</span>
      <select value={year ?? ""} onChange={(event) => onYear(event.target.value ? Number(event.target.value) : null)}>
        <option value="">전체</option>
        {years.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
    <label>
      <span>말머리</span>
      <select value={category ?? ""} onChange={(event) => onCategory((event.target.value || null) as DisplayCategory | null)}>
        <option value="">전체</option>
        {galleryConfig.categories.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
    <div className="search-sort-group" role="group" aria-label="검색 정렬">
      <span>정렬</span>
      <button className={sort === "latest" ? "active" : undefined} onClick={() => onSort("latest")}>최신순</button>
      <button className={sort === "oldest" ? "active" : undefined} onClick={() => onSort("oldest")}>오래된순</button>
      <button className={sort === "popular" ? "active" : undefined} onClick={() => onSort("popular")}>인기순</button>
    </div>
  </div>;
}
