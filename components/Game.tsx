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

  const [guess, setGuess] = useState<[number, number] | null>(null);

  const [results, pushResult] = useResults();

  const [status, setStatus] = useState<GameStatus>("start");

  return (
    <main className="game">
      <ControlsComponent
        region={regionId}
        setRegion={setRegionId}
        regions={regions}
        status={status}
        onGuess={() => {
          if (!guess || !picture) return;
          pushResult(computeResult(picture, guess));
          setStatus("done");
        }}
        onNew={() => {
          setPicNum((n) => n + 1);
          setGuess(null);
          setStatus("start");
        }}
      />

      <div className="col-span-full row-start-2">
        {status === "done" && (
          <>
            <div className="text-2xl font-semibold text-center">
              {results.at(-1)!.distance.toFixed(0)} meters away
            </div>
            <button className="mx-auto"></button>
          </>
        )}
      </div>

      <MapComponent
        guess={guess}
        setGuess={(guess) => {
          setGuess(guess);
          setStatus("guessing");
        }}
        picture={picture}
        region={region}
        view={view}
        status={status}
      />

      <PictureComponent value={picture} />
    </main>
  );
}

function useResults(): [GameResult[], (_: GameResult) => void] {
  const [value, setValue] = useState<GameResult[]>([]);
  const addResult = (result: GameResult) => {
    setValue((value) => [...value, result]);
    localStorage.setItem("results", JSON.stringify([...value, result]));
  };
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("results") || "[]");
    setValue(stored);
  }, []);
  return [value, addResult];
}
