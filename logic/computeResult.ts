import { Challenge } from "@/hooks/useChallenge";
import { getDistance } from "ol/sphere";
import { ChallengeView } from "./computeView";
import { Region } from "@/api/region";

export interface GameResult {
  ts: number;
  challenge: string;
  region_id: string;
  region_name?: string;
  distance: number;
  target: readonly [number, number];
  guess: readonly [number, number];
  view_center: readonly [number, number];
  view_radius: number;
}

/** Calculates the distance of the guess from the target.
 *
 * Returns the distance in meters.
 */
export default function computeResult(
  regions: Region[],
  challenge: Challenge,
  guess: Readonly<[number, number]>
): GameResult {
  const region = regions.find((r) => r.id === challenge.data.region_id);
  const target = [challenge.data.geo.lng, challenge.data.geo.lat] as const;
  const distance = Math.round(
    getDistance(target as unknown as any[], guess as unknown as any[])
  );
  return {
    ts: Date.now(),
    challenge: challenge.data.id,
    region_id: challenge.data.region_id,
    region_name: region?.name,
    distance,
    target,
    guess,
    view_center: challenge.view.center,
    view_radius: challenge.view.circle.getRadius(),
  };
}
