import { Region } from "@/api/region";
import { useEffect, useRef, useState } from "react";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS.js";
import WMTSCapabilities from "ol/format/WMTSCapabilities.js";
import proj4 from "proj4";
import * as olProj4 from "ol/proj/proj4";
import "ol/ol.css";
import { Options as WMTSOptions } from "ol/source/WMTS";
import { Picture } from "@/api/picture";
import { useGeographic } from "ol/proj.js";
import Zoom from "ol/control/Zoom";
import Rotate from "ol/control/Rotate";
import Attribution from "ol/control/Attribution";
import ScaleLine from "ol/control/ScaleLine";
import "@/os_brand.css";
import OSBranding from "@/os_brand";
import "./Map.css";
import { Feature, MapBrowserEvent, Overlay } from "ol";
import { GameStatus } from "@/logic/GameStatus";
import { LineString } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

// eslint-disable-next-line react-hooks/rules-of-hooks -- not a hook
useGeographic();

proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
);
olProj4.register(proj4);

export default function MapComponent({
  picture,
  region,
  guess,
  setGuess,
  status,
}: {
  picture?: Picture;
  region: Region;
  guess: [number, number] | null;
  setGuess: (_: [number, number]) => void;
  status: GameStatus;
}) {
  const [wmtsOptions, setWMTSOptions] = useState<WMTSOptions | null>(null);
  useEffect(() => {
    fetchWMTS(region.tiles).then((options) => setWMTSOptions(options));
  }, [region]);

  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const container = containerRef.current;
    if (!picture || !container || !wmtsOptions) return;

    const actual = [
      parseFloat(picture.longitude),
      parseFloat(picture.latitude),
    ];

    let attributions: string[];
    if (typeof wmtsOptions.attributions === "string") {
      attributions = [wmtsOptions.attributions];
    } else if (Array.isArray(wmtsOptions.attributions)) {
      attributions = wmtsOptions.attributions;
    } else {
      attributions = [];
    }
    if (region.tiles.extraAttributions) {
      attributions = attributions.concat(region.tiles.extraAttributions);
    }

    let map = new Map({
      target: container,
      view: new View({
        center: actual,
        constrainResolution: true,
        resolutions: region.tiles.resolutions,
        resolution: region.tiles.defaultResolution,
      }),
      layers: [
        new TileLayer({
          source: new WMTS({
            ...wmtsOptions,
            attributions,
          }),
          // extent: region.bbox,
        }),
      ],
      controls: [
        new Zoom(),
        new Rotate(),
        new Attribution({
          collapsed: false,
          collapsible: false,
        }),
        new ScaleLine({
          bar: true,
        }),
      ],
    });
    mapRef.current = map;

    map.addEventListener("click", (event) => {
      if (!(event instanceof MapBrowserEvent)) return;
      const status = statusRef.current;
      const coordinate = event.coordinate;
      if (status === "start" || status === "guessing") {
        setGuess([coordinate[0]!, coordinate[1]!]);
      }
    });

    return () => {
      map.dispose();
    };
  }, [setGuess, picture, region, wmtsOptions]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let marker: Overlay | null = null;
    if (guess) {
      const elem = document.createElement("div");
      elem.className = "map-guess-marker";

      marker = new Overlay({
        position: guess,
        positioning: "center-center",
        element: elem,
        stopEvent: false,
      });

      map.addOverlay(marker);
    }

    return () => {
      if (marker) {
        map.removeOverlay(marker);
      }
    };
  }, [guess]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !picture || !guess) return;

    const target: [number, number] = [
      parseFloat(picture.longitude),
      parseFloat(picture.latitude),
    ];

    let marker: Overlay | null = null;
    let layer: VectorLayer<VectorSource> | null = null;
    if (status === "done") {
      const elem = document.createElement("div");
      elem.className = "map-target-marker";

      marker = new Overlay({
        position: target,
        positioning: "center-center",
        element: elem,
        stopEvent: false,
      });

      const src = new VectorSource({});
      src.addFeature(
        new Feature({
          geometry: new LineString([target, guess]),
        })
      );
      layer = new VectorLayer({
        source: src,
        style: new Style({
          stroke: new Stroke({
            color: "rgba(80, 72, 229, 0.5)",
            width: 5,
          }),
        }),
      });

      map.addOverlay(marker);
      map.addLayer(layer);
    }

    return () => {
      if (marker) map.removeOverlay(marker);
      if (layer) map.removeLayer(layer);
    };
  }, [status, picture, guess]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (region.tiles.osBranding) {
      OSBranding.init({ elem: container });
    }

    return () => {
      document
        .querySelectorAll(".os-api-branding")
        .forEach((el) => el.remove());
    };
  }, [region.tiles.osBranding]);

  return (
    <div className="row-span-full row-start-3 col-span-full">
      <div ref={containerRef} className="w-full h-full relative"></div>
    </div>
  );
}

const capabilitiesParser = new WMTSCapabilities();

async function fetchWMTS(tiles: Region["tiles"]) {
  const resp = await fetch(tiles.capabilities);
  if (!resp.ok) {
    throw new Error("Failed to fetch WMTS capabilities");
  }
  const text = await resp.text();
  const capabilities = capabilitiesParser.read(text);
  const options = optionsFromCapabilities(capabilities, {
    layer: tiles.layer,
    matrixSet: tiles.matrixSet,
  });
  if (options === null) {
    throw new Error("Failed to parse WMTS capabilities");
  }
  return options;
}
