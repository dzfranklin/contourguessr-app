import {
  ChallengeData,
  ChallengeNotFoundError,
  fetchRandomChallenge,
} from "@/api/challenge";
import { Region, fetchRegions } from "@/api/region";
import GameComponent from "@/components/Game";
import { ChallengeProvider } from "@/hooks/useChallenge";
import { RegionsProvider } from "@/hooks/useRegions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ChallengeHomePage({
  searchParams,
}: {
  searchParams: { r?: string };
}) {
  const { regions, challenge } = await fetchPageData(
    searchParams.r || undefined
  );

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

async function fetchPageData(regionId?: string): Promise<{
  regions: Region[];
  challenge: ChallengeData;
}> {
  try {
    const [regions, challenge] = await Promise.all([
      fetchRegions(),
      fetchRandomChallenge(regionId),
    ]);
    return { regions, challenge };
  } catch (e) {
    if (e instanceof ChallengeNotFoundError) {
      notFound();
    }
    throw e;
  }
}
