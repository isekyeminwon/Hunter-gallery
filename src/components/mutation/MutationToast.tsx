export function MutationToast({ text }: { text: string | null }) {
  if (!text) return null;
  return <div className="mutation-toast" role="status">{text}</div>;
}
