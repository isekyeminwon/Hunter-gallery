import type { Post } from "../../types/post";
import { RichTextRenderer } from "../richtext/RichTextRenderer";

const deletedCopy: Record<string, string> = {
  AUTHOR_DELETED: "작성자가 삭제한 게시글입니다.",
  MODERATOR_DELETED: "관리자에 의해 삭제된 게시글입니다.",
  POLICY_DELETED: "운영원칙 위반으로 삭제된 게시글입니다.",
  MISSING: "존재하지 않는 게시글입니다.",
};

export function PostBody({ post }: { post: Post }) {
  if (post.deletedStatus) return <div className="deleted-post-message">{deletedCopy[post.deletedStatus] ?? "삭제된 게시글입니다."}</div>;
  return <article className="post-body"><RichTextRenderer text={post.content} /></article>;
}
