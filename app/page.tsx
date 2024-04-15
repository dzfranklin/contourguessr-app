import { fetchRegions } from "@/api/region";
import GameComponent from "@/components/Game";
import RegionSelectorComponent from "@/components/RegionSelector";

export default async function Home() {
  const regions = await fetchRegions();
  return <GameComponent regions={regions} />;
}
