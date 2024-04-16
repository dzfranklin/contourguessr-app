import { Picture } from "@/api/picture";
import { Point } from "ol/geom";

/** All in EPSG:4326 */
export interface GameView {
  guessableZone: [number, number, number, number];
  center: [number, number];
  target: [number, number];
}

// The maximum distance in meters the center of the guessable zone can be from
// the target. This is around 3 miles, or a little more than an hour of walking
const d_max = 5_000;

// The padding around the guessable zone, or the minimum distance target to the
// edge of the guessable zone.
// const p = 250;
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

  const t = new Point(target);
  // Transform into a crs with a unit of measurement in meters. This works as
  // long as d_max is reasonably small and target isn't near the poles.
  t.transform("EPSG:4326", "EPSG:3857");

  const x = picture.rx * d_max;
  const y = picture.ry * d_max;

  const min = t.clone();
  min.translate(-x - p, -(d_max - y) - p);

  const max = t.clone();
  max.translate(d_max - x + p, y + p);

  const center = new Point([
    (max.getCoordinates()[0] + min.getCoordinates()[0]) / 2,
    (max.getCoordinates()[1] + min.getCoordinates()[1]) / 2,
  ]);

  center.transform("EPSG:3857", "EPSG:4326");
  min.transform("EPSG:3857", "EPSG:4326");
  max.transform("EPSG:3857", "EPSG:4326");

  return {
    guessableZone: [
      min.getCoordinates()[0],
      min.getCoordinates()[1],
      max.getCoordinates()[0],
      max.getCoordinates()[1],
    ],
    center: [center.getCoordinates()[0], center.getCoordinates()[1]],
    target,
  };
}
