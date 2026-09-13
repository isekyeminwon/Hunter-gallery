import type { Comment } from "../types/post";

export interface CommentNode extends Comment { children: CommentNode[] }

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];
  for (const comment of comments) map.set(comment.id, { ...comment, children: [] });
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) map.get(node.parentId)!.children.push(node);
    else roots.push(node);
  }
  return roots;
}
