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
import { Circle, LineString, Point } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { FlatStyleLike } from "ol/style/flat";
import LayerGroup from "ol/layer/Group";
import { XYZ } from "ol/source";
import { useCheatMode } from "@/hooks/useCheatMode";
import { useChallenge } from "@/hooks/useChallenge";
import { ToggleSatelliteControl } from "./ToggleSatelliteControl";

// eslint-disable-next-line react-hooks/rules-of-hooks -- not a hook
useGeographic();

proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
);
olProj4.register(proj4);

export default function MapComponent({
  guess,
  setGuess,
  status,
}: {
  guess: [number, number] | null;
  setGuess: (_: [number, number]) => void;
  status: GameStatus;
}) {
  const { region, view } = useChallenge();
  const cheatMode = useCheatMode();

  const [wmtsOptions, setWMTSOptions] = useState<WMTSOptions | null>(null);
  useEffect(() => {
    const options = parseLayerOptions(region.map_layer);
    setWMTSOptions(options);
    return () => {
      setWMTSOptions(null);
    };
  }, [region]);

  const mapRef = useRef<Map | null>(null);
  const primaryLayerRef = useRef<TileLayer<WMTS> | null>(null);
  const imageryLayerRef = useRef<LayerGroup | null>(null);
  const toggleSatelliteControl = useRef<ToggleSatelliteControl | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const setGuessRef = useRef(setGuess);
  useEffect(() => {
    setGuessRef.current = setGuess;
  }, [setGuess]);

  useEffect(() => {
    const container = containerRef.current;
    if (!region || !view || !container || !wmtsOptions) return;

    let attributions: string[];
    if (typeof wmtsOptions.attributions === "string") {
      attributions = [wmtsOptions.attributions];
    } else if (Array.isArray(wmtsOptions.attributions)) {
      attributions = wmtsOptions.attributions;
    } else {
      attributions = [];
    }
    attributions = attributions.concat(region.map_layer.extra_attributions);

    const mbAuth = "?access_token=" + process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const mapboxAttribution = `© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>`;
    const imageryLayer = new LayerGroup({
      visible: false,
      opacity: 0.6,
      layers: [
        new TileLayer({
          source: new XYZ({
            url:
              "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpeg90" +
              mbAuth,
            projection: "EPSG:3857",
            attributions: [mapboxAttribution],
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url:
              "https://api.mapbox.com/v4/mapbox.naip/{z}/{x}/{y}.jpeg90" +
              mbAuth,
            minZoom: 13,
            maxZoom: 17,
            projection: "EPSG:3857",
            attributions: ["NAIP", mapboxAttribution],
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url:
              "https://api.mapbox.com/v4/mapbox.satellite-watermask{z}/{x}/{y}.jpeg90" +
              mbAuth,
            minZoom: 13,
            maxZoom: 17,
            projection: "EPSG:3857",
            attributions: [mapboxAttribution],
          }),
        }),
      ],
    });
    imageryLayerRef.current = imageryLayer;

    const primaryLayer = new TileLayer({
      source: new WMTS({
        ...wmtsOptions,
        attributions,
      }),
    });
    primaryLayerRef.current = primaryLayer;

    let map = new Map({
      target: container,
      view: new View({
        center: view.center,
        constrainResolution: true,
        resolutions: region.map_layer.resolutions,
        resolution: region.map_layer.default_resolution,
      }),
      layers: [primaryLayer, imageryLayer],
      controls: [
        new Zoom(),
        new Rotate(),
        (toggleSatelliteControl.current = new ToggleSatelliteControl({
          imageryLayer,
        })),
        new Attribution({}),
        new ScaleLine({
          bar: true,
        }),
      ],
    });
    mapRef.current = map;

    const src = new VectorSource();
    src.addFeature(
      new Feature({
        geometry: view.circle,
      })
    );

    let style: FlatStyleLike = {
      "stroke-color": "#4d7c0f",
      "stroke-width": 5,
    };

    if (cheatMode) {
      src.addFeature(
        new Feature({
          geometry: new Point(view.target),
        })
      );
      style = {
        ...style,
        "circle-radius": 5,
        "circle-fill-color": "red",
      };
    }

    map.addLayer(
      new VectorLayer({
        source: src,
        style,
      })
    );

    map.getView().fit(new Circle(view.center, view.circle.getRadius() * 0.6), {
      nearest: true,
    });

    map.addEventListener("click", (event) => {
      if (!(event instanceof MapBrowserEvent)) return;
      const status = statusRef.current;
      const c = event.coordinate as [number, number];
      if (!(status === "start" || status === "guessing")) return;
      setGuessRef.current(c);
    });

    return () => {
      map.dispose();
    };
  }, [region, wmtsOptions, view, cheatMode]);

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
    if (!map || !guess) return;

    const { target } = view;

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

      imageryLayerRef.current?.setVisible(true);
      toggleSatelliteControl.current?.enable();
    }

    return () => {
      if (marker) map.removeOverlay(marker);
      if (layer) map.removeLayer(layer);
      if (status === "done") {
        imageryLayerRef.current?.setVisible(false);
        toggleSatelliteControl.current?.disable();
      }
    };
  }, [status, view, guess]);

  useEffect(() => {
    const container = containerRef.current;
    if (!region.map_layer.os_branding || !container) return;

    if (region.map_layer.os_branding) {
      OSBranding.init({ elem: container });
    }

    return () => {
      document
        .querySelectorAll(".os-api-branding")
        .forEach((el) => el.remove());
    };
  }, [region.map_layer.os_branding]);

  return (
    <div className="row-span-full row-start-3 col-span-full">
      <div ref={containerRef} className="w-full h-full relative">
        <div className="mapbox-logo" />
      </div>
    </div>
  );
}

const capabilitiesParser = new WMTSCapabilities();

function parseLayerOptions(layer: Region["map_layer"]) {
  const capabilities = capabilitiesParser.read(layer.capabilities_xml);
  const options = optionsFromCapabilities(capabilities, {
    layer: layer.layer,
    matrixSet: layer.matrix_set,
  });
  if (options === null) {
    throw new Error("Failed to parse WMTS capabilities");
  }
  return options;
}
