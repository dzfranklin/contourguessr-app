import { fetchRegions } from "@/api/region";
import GameComponent from "@/components/Game";

const defaultRegion = "uk_lake_district";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const regions = await fetchRegions();

  let requestedRegion: string | undefined;
  if (typeof searchParams.region === "string") {
    requestedRegion = searchParams.region;
  } else if (Array.isArray(searchParams.region)) {
    requestedRegion = searchParams.region[0];
  }
  let region = regions.find((r) => r.id === requestedRegion) || regions[0];

  return <GameComponent regions={regions} region={region} />;
}
