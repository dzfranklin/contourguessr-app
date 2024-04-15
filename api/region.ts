import { API_ENDPOINT } from "./endpoint";

export interface Region {
  id: string;
  name: string;
  logo: string;
  bbox: [number, number, number, number];
  tiles: {
    capabilities: string;
    layer: string;
    matrixSet: string;
  };
}

export async function fetchRegions(): Promise<Region[]> {
  const resp = await fetch(API_ENDPOINT + "/region");
  if (!resp.ok) {
    throw new Error("Failed to fetch regions");
  }
  return resp.json();
}
