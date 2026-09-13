export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 50;
  const totalPages = Math.max(1, Math.ceil(rows.length / safePageSize));
  const normalizedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const safePage = Math.min(Math.max(1, normalizedPage), totalPages);
  const start = (safePage - 1) * safePageSize;
  return { rows: rows.slice(start, start + safePageSize), page: safePage, totalPages };
}
