import type { Comment } from "../../types/post";
import { buildCommentTree } from "../../lib/commentTree";
import { CommentItem } from "./CommentItem";
export function CommentList({ comments }: { comments: Comment[] }) {
  const tree = buildCommentTree(comments);
  return <section className="comments-section">
    <div className="section-title">댓글 <strong>{comments.length}</strong></div>
    <div className="comment-list">{tree.length ? tree.map((node) => <CommentItem key={node.id} node={node} />) : <div className="no-comments">등록된 댓글이 없습니다.</div>}</div>
  </section>;
}
