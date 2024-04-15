import { API_ENDPOINT } from "./endpoint";

export interface Picture {
  id: string;
  sizes: PictureSize[];
  ownerUsername: string;
  ownerIcon: string;
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
  const resp = await fetch(`${API_ENDPOINT}/picture/${region}/random`);
  if (!resp.ok) {
    throw new Error("Failed to fetch regions");
  }
  return resp.json();
}
