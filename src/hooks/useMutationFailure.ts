import { useState } from "react";
import type { MutationAction } from "../components/mutation/MutationGuard";

export function useMutationFailure() {
  const [action, setAction] = useState<MutationAction | null>(null);
  return { action, trigger: setAction, close: () => setAction(null) };
}
