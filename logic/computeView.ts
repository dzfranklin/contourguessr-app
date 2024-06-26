import { ChallengeData } from "@/api/challenge";
import * as turf from "@turf/turf";
import { distance } from "ol/coordinate";
import { Circle } from "ol/geom";

/** All in EPSG:4326 */
export interface ChallengeView {
  center: [number, number];
  circle: Circle;
  target: [number, number];
}

// The padding around the guessable zone, or the minimum distance target to the
// edge of the guessable zone.
// const p = 0.5;
const p = 0.25;

/*** Compoutes a random view for a given target.
 *
 * `d` is the maximum distance in km the center of the guessable zone can be from
 * the target. This makes the diameter about 3 miles.
 *
 * Target is a pair of coordinates in EPSG:4326.
 */
export function computeView(
  challenge: ChallengeData,
  d: number
): ChallengeView {
  const target: [number, number] = [challenge.geo.lng, challenge.geo.lat];
  const r = challenge.r;

  const angle = r.x * 360;
  const length = r.y * (d - p);
  const centerP = turf.destination(target, length, angle);
  const edgeP = turf.destination(centerP, d, 90);
  const radius = distance(
    centerP.geometry.coordinates,
    edgeP.geometry.coordinates
  );
  const circle = new Circle(centerP.geometry.coordinates, radius);

  const center = centerP.geometry.coordinates as [number, number];

  return {
    center,
    circle,
    target,
  };
}
