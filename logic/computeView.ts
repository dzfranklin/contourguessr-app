import { Picture } from "@/api/picture";
import { Point } from "ol/geom";
import { getDistance } from "ol/sphere";
import { destination, midpoint } from "@turf/turf";
import { point } from "@turf/helpers";

// TODO: Debug these calculations

/** All in EPSG:4326 */
export interface GameView {
  guessableZone: [number, number, number, number];
  center: [number, number];
  target: [number, number];
}

// The maximum distance in km the center of the guessable zone can be from
// the target.
const d = 3.0;

// The padding around the guessable zone, or the minimum distance target to the
// edge of the guessable zone.
// const p = 0.5;
const p = 0;

/*** Compoutes a random view for a given target.
 *
 * Target is a pair of coordinates in EPSG:4326.
 */
export function computeView(picture: Picture): GameView {
  const target: [number, number] = [
    parseFloat(picture.longitude),
    parseFloat(picture.latitude),
  ];

  const x = picture.rx * d + p;
  const y = picture.ry * d + p;

  const minP = destination(destination(point(target), x, 270), y, 180);
  const maxP = destination(
    destination(point(target), d + 2 * p, 0),
    d + 2 * p,
    90
  );
  const centerP = midpoint(minP, maxP);

  const min = minP.geometry.coordinates as [number, number];
  const max = maxP.geometry.coordinates as [number, number];
  const center = centerP.geometry.coordinates as [number, number];

  console.log(
    getDistance([min[0], max[1]], [max[0], max[1]]) / 1000,
    getDistance([min[0], max[1]], [min[0], min[1]]) / 1000
  );

  return {
    guessableZone: [min[0], min[1], max[0], max[1]],
    center,
    target,
  };
}
