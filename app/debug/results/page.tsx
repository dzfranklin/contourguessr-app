"use client";

import DebugView from "@/components/DebugView";
import { useResults } from "@/hooks/useResults";

export default function DebugResultsPage() {
  const [results, _] = useResults();
  return (
    <ul className="p-4">
      {results.length === 0 && <li>No results yet</li>}
      {results
        .map((r, i) => [r, i] as const)
        .toReversed()
        .map(([r, i]) => (
          <li key={i}>
            <details>
              <summary>
                {i}: {new Date(r.ts).toString()}
              </summary>
              <DebugView value={r} />
            </details>
          </li>
        ))}
    </ul>
  );
}
