import { Picture } from "@/api/picture";
import { getDistance } from "ol/sphere";

export interface GameResult {
  ts: number;
  picture: string;
  distance: number;
}

/** Calculates the distance of the guess from the target.
 *
 * Returns the distance in meters.
 */
export default function computeResult(
  picture: Picture,
  guess: Readonly<[number, number]>
): GameResult {
  const target = [parseFloat(picture.longitude), parseFloat(picture.latitude)];
  const distance = Math.round(
    getDistance(target as unknown as any[], guess as unknown as any[])
  );
  return { ts: Date.now(), picture: picture.id, distance };
}
