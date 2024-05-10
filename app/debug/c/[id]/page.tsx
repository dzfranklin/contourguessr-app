import { API_ENDPOINT } from "@/api/endpoint";
import DebugView from "@/components/DebugView";

export default async function DebugChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const { debugInfo } = await fetchPageData(params.id);
  return (
    <div className="m-4">
      <DebugView value={debugInfo} />
    </div>
  );
}

async function fetchPageData(
  challengeId: string
): Promise<{ debugInfo: object }> {
  const url = new URL(API_ENDPOINT);
  url.pathname = "/debug/challenge";
  url.searchParams.set("id", challengeId);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw new Error("Failed to fetch challenge: " + resp.statusText);
  }
  const debugInfo = await resp.json();
  return { debugInfo };
}
