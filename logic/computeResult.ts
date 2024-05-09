import { Challenge } from "@/hooks/useChallenge";
import { getDistance } from "ol/sphere";
import { ChallengeView } from "./computeView";

export interface GameResult {
  ts: number;
  picture: string;
  distance: number;
  target: readonly [number, number];
  view_center: readonly [number, number];
  view_radius: number;
}

/** Calculates the distance of the guess from the target.
 *
 * Returns the distance in meters.
 */
export default function computeResult(
  challenge: Challenge,
  guess: Readonly<[number, number]>
): GameResult {
  const target = [challenge.data.geo.lng, challenge.data.geo.lat] as const;
  const distance = Math.round(
    getDistance(target as unknown as any[], guess as unknown as any[])
  );
  return {
    ts: Date.now(),
    picture: challenge.data.id,
    distance,
    target,
    view_center: challenge.view.center,
    view_radius: challenge.view.circle.getRadius(),
  };
}
