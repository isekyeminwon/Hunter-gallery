import { useEffect, type PropsWithChildren } from "react";

export function Modal({ open, onClose, children }: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
