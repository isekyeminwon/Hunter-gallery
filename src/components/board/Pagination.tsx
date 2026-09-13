export function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const windowStart = Math.max(1, Math.min(page - 5, totalPages - 9));
  const pages = Array.from({ length: Math.min(10, totalPages) }, (_, i) => windowStart + i);
  return <nav className="pagination" aria-label="페이지 이동">
    <button disabled={page <= 1} onClick={() => onPage(page - 1)}>‹</button>
    {pages.map((p) => <button key={p} className={p === page ? "active" : undefined} onClick={() => onPage(p)}>{p}</button>)}
    <button disabled={page >= totalPages} onClick={() => onPage(page + 1)}>›</button>
  </nav>;
}
