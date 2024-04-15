"use client";

import { useEffect, useState } from "react";
import { Region } from "@/api/region";
import { Picture, fetchRandomPicture } from "@/api/picture";
import PictureComponent from "./Picture";
import ControlsComponent from "./Controls";
import MapComponent from "./Map";
import "./Game.css";

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
    <main className="game">
      <ControlsComponent
        region={regionId}
        setRegion={setRegionId}
        regions={regions}
        newPicture={() => setPicNum((p) => p + 1)}
      />

      <MapComponent picture={picture} region={region} />

      <PictureComponent value={picture} />
    </main>
  );
}
