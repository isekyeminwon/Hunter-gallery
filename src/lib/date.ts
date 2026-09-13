export function formatBoardDate(timestamp: string) {
  const d = new Date(timestamp);
  const nowYear = 2042;
  if (d.getFullYear() === nowYear) {
    return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function formatFullDate(timestamp: string) {
  const d = new Date(timestamp);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(d);
}
