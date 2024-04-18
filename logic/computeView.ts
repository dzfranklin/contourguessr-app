import { Picture } from "@/api/picture";
import * as turf from "@turf/turf";
import { distance } from "ol/coordinate";
import { Circle } from "ol/geom";

/** All in EPSG:4326 */
export interface GameView {
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
export function computeView(picture: Picture, d: number): GameView {
  const target: [number, number] = [
    parseFloat(picture.longitude),
    parseFloat(picture.latitude),
  ];

  const { rx, ry } = picture;

  const angle = rx * 360;
  const length = ry * d;
  const centerP = turf.destination(target, length, angle);
  const edgeP = turf.destination(centerP, d + p, 90);
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
