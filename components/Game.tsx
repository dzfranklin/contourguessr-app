"use client";

import { useEffect, useState } from "react";
import { Region } from "@/api/region";
import { Picture, fetchRandomPicture } from "@/api/picture";
import PictureComponent from "./Picture";
import ControlsComponent from "./Controls";
import MapComponent from "./Map";
import "./Game.css";
import computeResult, { GameResult } from "@/logic/computeResult";
import { GameStatus } from "@/logic/GameStatus";
import { GameView, computeView } from "@/logic/computeView";

export default function GameComponent({ regions }: { regions: Region[] }) {
  const [picNum, setPicNum] = useState(0);

  const [regionId, setRegionId] = useState(regions[0]!.id);
  const region = regions.find((r) => r.id === regionId);
  if (!region) throw new Error("Invalid region");

  const [picture, setPicture] = useState<Picture | undefined>(undefined);
  const [view, setView] = useState<GameView | undefined>(undefined);
  useEffect(() => {
    setPicture(undefined);
    setView(undefined);
    fetchRandomPicture(regionId).then((picture) => {
      const target: [number, number] = [
        parseFloat(picture.longitude),
        parseFloat(picture.latitude),
      ];
      const view = computeView(target);

      setPicture(picture);
      setView(view);
    });
  }, [regionId, picNum]);
  const target = view?.target;

  const [guess, setGuess] = useState<[number, number] | null>(null);

  const [result, setResult] = useState<GameResult | null>(null);

  const newPicture = () => {
    setPicNum((n) => n + 1);
    setGuess(null);
    setResult(null);
  };

  let status: GameStatus;
  if (result) {
    status = "done";
  } else if (guess) {
    status = "guessing";
  } else {
    status = "start";
  }

  return (
    <main className="game">
      <ControlsComponent
        region={regionId}
        setRegion={setRegionId}
        regions={regions}
        status={status}
        onGuess={() => {
          if (!guess || !target) return;
          const result = computeResult(target, guess);
          setResult(result);
        }}
        onNew={newPicture}
      />

      <div className="col-span-full row-start-2">
        {result && (
          <>
            <div className="text-2xl font-semibold text-center">
              {result.distance.toFixed(0)} meters away
            </div>
            <button className="mx-auto"></button>
          </>
        )}
      </div>

      <MapComponent
        guess={guess}
        setGuess={setGuess}
        picture={picture}
        region={region}
        view={view}
        status={status}
      />

      <PictureComponent value={picture} />
    </main>
  );
}
