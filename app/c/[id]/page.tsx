import {
  ChallengeData,
  ChallengeNotFoundError,
  fetchChallenge,
} from "@/api/challenge";
import { Region, fetchRegions } from "@/api/region";
import GameComponent from "@/components/Game";
import { ChallengeProvider } from "@/hooks/useChallenge";
import { RegionsProvider } from "@/hooks/useRegions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const { regions, challenge } = await fetchPageData(params.id);

  return (
    <RegionsProvider value={regions}>
      <ChallengeProvider data={challenge}>
        <Suspense>
          <GameComponent />
        </Suspense>
      </ChallengeProvider>
    </RegionsProvider>
  );
}

async function fetchPageData(id: string): Promise<{
  regions: Region[];
  challenge: ChallengeData;
}> {
  try {
    const [regions, challenge] = await Promise.all([
      fetchRegions(),
      fetchChallenge(id),
    ]);
    return { regions, challenge };
  } catch (e) {
    if (e instanceof ChallengeNotFoundError) {
      notFound();
    }
    throw e;
  }
}
