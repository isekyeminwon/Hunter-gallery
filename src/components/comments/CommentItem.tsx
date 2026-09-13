import type { CommentNode } from "../../lib/commentTree";
import { formatFullDate } from "../../lib/date";
import { RichTextRenderer } from "../richtext/RichTextRenderer";
import { DeletedComment } from "./DeletedComment";

export function CommentItem({ node, depth = 0 }: { node: CommentNode; depth?: number }) {
  return <div className={`comment-item depth-${Math.min(depth, 2)}`}>
    <div className="comment-line">
      {depth > 0 && <span className="reply-arrow">↳</span>}
      <div className="comment-main">
        <div className="comment-meta">
          <strong>{node.author.name}</strong>{node.author.ip && <span>({node.author.ip})</span>}
          <time>{formatFullDate(node.timestamp)}</time>
        </div>
        <div className="comment-content">{node.deleted ? <DeletedComment /> : <RichTextRenderer text={node.content} />}</div>
      </div>
    </div>
    {node.children.map((child) => <CommentItem key={child.id} node={child} depth={depth + 1} />)}
  </div>;
}
