"use client";

import { createContext, useContext, useMemo } from "react";
import { ChallengeData } from "@/api/challenge";
import { ChallengeView, computeView } from "@/logic/computeView";
import { useDFactor } from "./useDFactor";
import { Region } from "@/api/region";
import { useRegions } from "./useRegions";

export interface Challenge {
  data: ChallengeData;
  view: ChallengeView;
  region: Region;
}

const ChallengeContext = createContext<Challenge | null>(null);

export function ChallengeProvider({
  children,
  data,
}: {
  children?: React.ReactNode;
  data: ChallengeData;
}) {
  const regions = useRegions();
  const dFactor = useDFactor();
  const value = useMemo(() => {
    const view = computeView(data, dFactor);
    const region = regions.find((r) => r.id === data.region_id);
    if (!region) {
      throw new Error("Invalid region in challenge data: " + data.region_id);
    }
    return {
      data,
      view,
      region,
    };
  }, [dFactor, regions, data]);
  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const challenge = useContext(ChallengeContext);
  if (!challenge) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  return challenge;
}
