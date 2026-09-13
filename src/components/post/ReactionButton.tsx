import { useEffect, useState } from "react";
import { MutationToast } from "../mutation/MutationToast";

export function ReactionButton({ recommend }: { recommend: number }) {
  const [display, setDisplay] = useState(recommend);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setDisplay(recommend), [recommend]);

  const click = () => {
    if (busy) return;
    setBusy(true);
    setDisplay(recommend + 1);
    window.setTimeout(() => {
      setDisplay(recommend);
      setToast("반응 데이터 동기화에 실패했습니다. · ACCESS_ORIGIN_UNVERIFIED");
      setBusy(false);
      window.setTimeout(() => setToast(null), 2400);
    }, 300);
  };

  return <div className="reaction-area">
    <button className="recommend-button" onClick={click} aria-label="게시글 추천">
      <span className="recommend-icon">▲</span>
      <span>추천</span>
      <strong>{display.toLocaleString("ko-KR")}</strong>
    </button>
    <MutationToast text={toast} />
  </div>;
}
