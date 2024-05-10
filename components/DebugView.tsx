"use client";

import dynamic from "next/dynamic";

// This library is not compatible with SSR
const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

export default function DebugView({ value }: { value: object }) {
  return (
    <ReactJson
      src={value}
      enableClipboard={true}
      collapsed={2}
      collapseStringsAfterLength={64}
      displayObjectSize={false}
      displayDataTypes={false}
    />
  );
}
