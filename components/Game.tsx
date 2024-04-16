"use client";

import { useEffect, useState } from "react";
import { Region } from "@/api/region";
import { Picture, fetchPicture, fetchRandomPicture } from "@/api/picture";
import PictureComponent from "./Picture";
import ControlsComponent from "./Controls";
import MapComponent from "./Map";
import "./Game.css";
import computeResult, { GameResult } from "@/logic/computeResult";
import { GameStatus } from "@/logic/GameStatus";
import { GameView, computeView } from "@/logic/computeView";
import { useSearchParams } from "next/navigation";

export default function GameComponent({ regions }: { regions: Region[] }) {
  const searchParams = useSearchParams();
  const force = searchParams.get("force");

  const [picNum, setPicNum] = useState(0);

  let [regionId, setRegionId] = useState(regions[0]!.id);
  if (force) {
    regionId = force.split(",")[0];
  }
  const region = regions.find((r) => r.id === regionId);
  if (!region) throw new Error("Invalid region");

  const [picture, setPicture] = useState<Picture | undefined>(undefined);
  const [view, setView] = useState<GameView | undefined>(undefined);
  useEffect(() => {
    setPicture(undefined);
    setView(undefined);

    const assign = (picture: Picture) => {
      const view = computeView(picture);
      setPicture(picture);
      setView(view);
    };

    if (force) {
      const [region, pictureId] = force.split(",");
      fetchPicture(region, pictureId).then(assign);
    } else {
      fetchRandomPicture(regionId).then(assign);
    }
  }, [regionId, picNum, force]);

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
        results={results}
      />

      <div className="col-span-full row-start-2">
        {status === "done" && (
          <div className="flex justify-center gap-8 my-4">
            <div className="text-xl font-semibold text-center">
              Your guess is off by {results.at(-1)!.distance.toFixed(0)} meters
            </div>

            <button
              className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => {
                setPicNum((n) => n + 1);
                setGuess(null);
                setStatus("start");
              }}
            >
              New challenge
            </button>
          </div>
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
