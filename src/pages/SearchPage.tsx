import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/search/SearchBar";
import { SearchFilters } from "../components/search/SearchFilters";
import { SearchResultRow } from "../components/search/SearchResultRow";
import { Pagination } from "../components/board/Pagination";
import { useSearchIndex } from "../hooks/useSearch";
import { searchRows, type SearchScope } from "../lib/search";
import { sortPosts, type SortMode } from "../lib/sorting";
import { paginate } from "../lib/pagination";
import { EmptyState } from "../components/common/EmptyState";
import { galleryConfig } from "../data/galleryConfig";
import type { DisplayCategory } from "../types/post";

const searchScopes: SearchScope[] = ["title", "titleBody", "author", "comments"];
const sortModes: SortMode[] = ["latest", "oldest", "popular"];

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const scopeParam = params.get("scope") as SearchScope | null;
  const scope = scopeParam && searchScopes.includes(scopeParam) ? scopeParam : "titleBody";
  const sortParam = params.get("sort") as SortMode | null;
  const sort = sortParam && sortModes.includes(sortParam) ? sortParam : "latest";
  const yearParam = Number(params.get("year"));
  const year = Number.isInteger(yearParam) && yearParam >= 2022 && yearParam <= 2042 ? yearParam : null;
  const categoryParam = params.get("category") as DisplayCategory | null;
  const category = categoryParam && galleryConfig.categories.includes(categoryParam) ? categoryParam : null;
  const page = Number(params.get("page") || "1");
  const { rows, loading, error } = useSearchIndex();

  const filtered = useMemo(() => {
    let result = searchRows(rows, query, scope);
    if (year) result = result.filter((row) => row.year === year);
    if (category) result = result.filter((row) => row.displayCategory === category);
    return sortPosts(result, sort);
  }, [rows, query, scope, sort, year, category]);

  const pageResult = paginate(filtered, page, galleryConfig.pageSize);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    setParams(next);
  };

  const goPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    if (nextPage <= 1) next.delete("page"); else next.set("page", String(nextPage));
    setParams(next);
  };

  return <>
    <div className="search-page-head"><h2>검색</h2><span>2022 ~ 2042.09.17</span></div>
    <SearchBar
      initialQuery={query}
      initialScope={scope}
      preserve={{ sort, year: year ? String(year) : null, category }}
    />
    <SearchFilters
      sort={sort}
      year={year}
      category={category}
      onSort={(value) => updateParam("sort", value === "latest" ? null : value)}
      onYear={(value) => updateParam("year", value ? String(value) : null)}
      onCategory={(value) => updateParam("category", value)}
    />
    {loading && <div className="loading">검색 인덱스를 불러오는 중...</div>}
    {error && <EmptyState>{error}</EmptyState>}
    {!loading && query && <div className="search-count"><strong>“{query}”</strong> 검색결과 {filtered.length}건</div>}
    <div className="search-results">
      {pageResult.rows.map((row) => <SearchResultRow key={row.id} row={row} query={query} scope={scope} />)}
    </div>
    {!loading && query && !filtered.length && <EmptyState>검색 결과가 없습니다.</EmptyState>}
    <Pagination page={pageResult.page} totalPages={pageResult.totalPages} onPage={goPage} />
  </>;
}
