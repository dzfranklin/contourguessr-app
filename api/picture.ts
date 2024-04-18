import { API_ENDPOINT } from "./endpoint";

export interface Picture {
  id: string;
  sizes: PictureSize[];
  rx: number;
  ry: number;
  ownerUsername: string;
  ownerIcon: string;
  ownerWebpage: string;
  title: string;
  description: string;
  dateTaken: string;
  latitude: string;
  longitude: string;
  locationAccuracy: string;
  locationDescription: string;
  url: string;
}

export interface PictureSize {
  label: string;
  width: number;
  height: number;
  source: string;
}

export async function fetchRandomPicture(region: string): Promise<Picture> {
  return fetchPicture(region, "random");
}

export async function fetchPicture(
  region: string,
  id: string
): Promise<Picture> {
  const resp = await fetch(`${API_ENDPOINT}/picture/${region}/${id}`);
  if (!resp.ok) {
    throw new Error("Failed to fetch picture data");
  }
  return resp.json();
}
