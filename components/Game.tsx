"use client";

import { useEffect, useState } from "react";
import RegionSelectorComponent from "./RegionSelector";
import { Region } from "@/api/region";
import { Picture, PictureSize, fetchRandomPicture } from "@/api/picture";
import PictureComponent from "./Picture";
import ControlsComponent from "./Controls";

export default function GameComponent({
  regions: regions,
}: {
  regions: Region[];
}) {
  const [picNum, setPicNum] = useState(0);
  const [region, setRegion] = useState(regions[0]!.id);

  const [picture, setPicture] = useState<Picture | undefined>(undefined);
  useEffect(() => {
    setPicture(undefined);
    fetchRandomPicture(region).then(setPicture);
  }, [region, picNum]);

  return (
    <main className="m-4">
      <ControlsComponent
        region={region}
        setRegion={setRegion}
        regions={regions}
        newPicture={() => setPicNum((p) => p + 1)}
      />

      <PictureComponent value={picture} />
    </main>
  );
}
