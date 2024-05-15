import { API_ENDPOINT } from "./endpoint";

export interface ChallengeData {
  id: string;
  region_id: string;
  geo: {
    lng: number;
    lat: number;
  };
  title: string;
  description_html: string;
  date_taken?: string;
  link: string;
  src: {
    regular: PictureSrc;
    large: PictureSrc;
  };
  photographer: {
    icon: string;
    text: string;
    link: string;
  };
  r: {
    x: number;
    y: number;
  };
}

export interface PictureSrc {
  src: string;
  width: number;
  height: number;
}

export class ChallengeNotFoundError extends Error {
  constructor(id: string) {
    super("Challenge not found: " + id);
  }
}

export async function fetchChallenge(id: string): Promise<ChallengeData> {
  const resp = await fetch(API_ENDPOINT + "/challenge/" + id);
  if (!resp.ok) {
    if (resp.status === 404) {
      throw new ChallengeNotFoundError(id);
    } else {
      throw new Error("Failed to fetch challenge: " + resp.statusText);
    }
  }
  return resp.json();
}

export async function fetchRandomChallenge(
  region?: string
): Promise<ChallengeData> {
  const resp = await fetch(
    API_ENDPOINT + "/challenge/random" + (region ? "?region=" + region : ""),
    {
      cache: "no-store",
    }
  );
  if (!resp.ok) {
    throw new Error("Failed to fetch random challenge: " + resp.statusText);
  }
  return resp.json();
}
