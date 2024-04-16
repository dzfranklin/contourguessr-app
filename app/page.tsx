import { fetchRegions } from "@/api/region";
import GameComponent from "@/components/Game";
import { Suspense } from "react";

export default async function Home() {
  const regions = await fetchRegions();
  return (
    <Suspense>
      <GameComponent regions={regions} />
    </Suspense>
  );
}
