import { API_ENDPOINT } from "./endpoint";

export interface Region {
  id: string;
  geo_json: {
    type: "Polygon";
    coordinates: [number, number][];
  };
  name: string;
  logo_url?: string;
  bbox: {
    min_lng: number;
    max_lng: number;
    min_lat: number;
    max_lat: number;
  };
  map_layer: {
    id: string;
    name: string;
    capabilities_xml: string;
    layer: string;
    matrix_set: string;
    resolutions: number[];
    default_resolution: number;
    os_branding: boolean;
    extra_attributions: string[];
  };
}

export async function fetchRegions(): Promise<Region[]> {
  const resp = await fetch(API_ENDPOINT + "/region");
  if (!resp.ok) {
    throw new Error("Failed to fetch regions");
  }
  return resp.json();
}
