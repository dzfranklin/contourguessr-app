import { getDistance } from "ol/sphere";

export interface GameResult {
  distance: number;
}

/** Calculates the distance of the guess from the target.
 *
 * Returns the distance in meters.
 */
export default function computeResult(
  target: Readonly<[number, number]>,
  guess: Readonly<[number, number]>
): GameResult {
  const distance = getDistance(
    target as unknown as any[],
    guess as unknown as any[]
  );
  return { distance };
}
