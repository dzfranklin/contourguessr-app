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

// eslint-disable-next-line react-hooks/rules-of-hooks -- not a hook
useGeographic();

proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
);
olProj4.register(proj4);

export default function MapComponent({
  picture: picture,
  region: region,
}: {
  picture?: Picture;
  region: Region;
}) {
  const [wmtsOptions, setWMTSOptions] = useState<WMTSOptions | null>(null);
  useEffect(() => {
    fetchWMTS(region.tiles).then((options) => setWMTSOptions(options));
  }, [region]);

  const containerRef = useRef<HTMLDivElement>(null);

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

    return () => {
      map.dispose();
    };
  }, [picture, region, wmtsOptions]);

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
    <div className="row-span-full row-start-2 col-span-full">
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
