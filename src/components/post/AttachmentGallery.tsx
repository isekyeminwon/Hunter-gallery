import { useState } from "react";
import type { Attachment } from "../../types/post";
import { Modal } from "../common/Modal";

export function AttachmentGallery({ attachments }: { attachments: Attachment[] }) {
  const [active, setActive] = useState<Attachment | null>(null);
  if (!attachments.length) return null;
  return <>
    <div className="attachment-gallery">
      {attachments.map((attachment) => attachment.status === "lost" || !attachment.src ? (
        <div key={attachment.id} className="attachment-lost">첨부 이미지를 불러올 수 없습니다.</div>
      ) : (
        <button key={attachment.id} className="attachment-button" onClick={() => setActive(attachment)}>
          <img src={attachment.src} alt={attachment.alt ?? "첨부 이미지"} loading="lazy" />
        </button>
      ))}
    </div>
    <Modal open={Boolean(active)} onClose={() => setActive(null)}>
      {active?.src && <img className="image-modal" src={active.src} alt={active.alt ?? "첨부 이미지"} />}
    </Modal>
  </>;
}
