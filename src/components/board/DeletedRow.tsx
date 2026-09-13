import { BoardRow } from "./BoardRow";
import type { PostIndexItem } from "../../types/post";
export function DeletedRow({ row }: { row: PostIndexItem }) { return <BoardRow row={row} />; }
