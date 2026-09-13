import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { mutationMessages, type MutationAction } from "./MutationGuard";

export function MutationDialog({ action, onClose }: { action: MutationAction | null; onClose: () => void }) {
  const message = action ? mutationMessages[action] : null;
  return (
    <Modal open={Boolean(message)} onClose={onClose}>
      {message && <>
        <div className="dialog-title">{message.title}</div>
        <div className="dialog-copy">{message.body.map((line) => <p key={line}>{line}</p>)}</div>
        <div className="error-code">{message.code}</div>
        <div className="dialog-actions"><Button onClick={onClose}>확인</Button></div>
      </>}
    </Modal>
  );
}
