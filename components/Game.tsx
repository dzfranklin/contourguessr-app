"use client";

import { useEffect, useState } from "react";
import RegionSelectorComponent from "./RegionSelector";
import { Region } from "@/api/region";
import { Picture, PictureSize, fetchRandomPicture } from "@/api/picture";
import PictureComponent from "./Picture";
import ControlsComponent from "./Controls";
import MapComponent from "./Map";

export default function GameComponent({
  regions: regions,
}: {
  regions: Region[];
}) {
  const [picNum, setPicNum] = useState(0);

  const [regionId, setRegionId] = useState(regions[0]!.id);
  const region = regions.find((r) => r.id === regionId);
  if (!region) throw new Error("Invalid region");

  const [picture, setPicture] = useState<Picture | undefined>(undefined);
  useEffect(() => {
    setPicture(undefined);
    fetchRandomPicture(regionId).then(setPicture);
  }, [regionId, picNum]);

  return (
    <main className="m-4">
      <ControlsComponent
        region={regionId}
        setRegion={setRegionId}
        regions={regions}
        newPicture={() => setPicNum((p) => p + 1)}
      />

      <PictureComponent value={picture} />

      <MapComponent picture={picture} region={region} />
    </main>
  );
}
