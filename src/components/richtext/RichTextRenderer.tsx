import { Fragment, type ReactNode } from "react";
import { CON_TOKEN_REGEX } from "../../lib/richTextParser";
import { HunterCon } from "./HunterCon";

export function RichTextRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  return <div className="rich-text">{lines.map((line, lineIndex) => {
    const nodes: ReactNode[] = [];
    CON_TOKEN_REGEX.lastIndex = 0;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = CON_TOKEN_REGEX.exec(line))) {
      if (match.index > last) nodes.push(line.slice(last, match.index));
      nodes.push(<HunterCon key={`${lineIndex}-${match.index}`} slug={match[1]} />);
      last = match.index + match[0].length;
    }
    if (last < line.length) nodes.push(line.slice(last));
    return <Fragment key={lineIndex}>{nodes.length ? nodes : " "}{lineIndex < lines.length - 1 && <br />}</Fragment>;
  })}</div>;
}
