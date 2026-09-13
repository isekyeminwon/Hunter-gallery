import { useState } from "react";
import { MutationDialog } from "../mutation/MutationDialog";
import { useMutationFailure } from "../../hooks/useMutationFailure";

export function CommentComposer() {
  const [value, setValue] = useState("");
  const mutation = useMutationFailure();
  const submit = () => {
    if (!value.trim()) return;
    mutation.trigger("WRITE_COMMENT");
    window.setTimeout(() => setValue(""), 50);
  };
  return <>
    <div className="comment-composer">
      <textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="댓글을 입력하세요" aria-label="댓글 입력" />
      <button onClick={submit}>등록</button>
    </div>
    <MutationDialog action={mutation.action} onClose={mutation.close} />
  </>;
}
