let endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
if (!endpoint) {
  throw new Error("API_ENDPOINT is not set");
}
if (process.env.NODE_ENV === "development") {
  endpoint = endpoint.replace(/^https:/, "http:");
}

export const API_ENDPOINT = endpoint;
