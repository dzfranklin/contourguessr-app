"use client";

import {
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

const defaultDFactor = 2.5;

export default function GameComponent({ regions }: { regions: Region[] }) {
  const searchParams = useSearchParams();
  const cheatMode = searchParams.get("_cheat") !== null;
  const dFactor = searchParams.get("_d")
    ? parseFloat(searchParams.get("_d")!)
    : defaultDFactor;
  const initialRegionParam = useRef(searchParams.get("r") || undefined);
  const initialPictureParam = useRef(searchParams.get("p") || undefined);

  const [picNum, setPicNum] = useState(0);

  const [region, setRegionId] = useRegion(regions, initialRegionParam);

  const [picture, setPicture] = useState<Picture | undefined>(undefined);
  const [view, setView] = useState<GameView | undefined>(undefined);
  useEffect(() => {
    setPicture(undefined);
    setView(undefined);

    if (!region) return;

    const assign = (picture: Picture) => {
      const view = computeView(picture, dFactor);
      setPicture(picture);
      setView(view);
    };

    if (initialRegionParam.current && initialPictureParam.current) {
      fetchPicture(
        initialRegionParam.current,
        initialPictureParam.current
      ).then(assign);
    } else {
      fetchRandomPicture(region.id).then(assign);
    }
  }, [region, picNum]);

  useEffect(() => {
    if (
      region &&
      region.id !== initialRegionParam.current &&
      initialRegionParam.current
    ) {
      location.search = "";
    }
  }, [region]);

  const [guess, setGuess] = useState<[number, number] | null>(null);

  const [results, pushResult] = useResults();

  const [status, setStatus] = useState<GameStatus>("start");

  return (
    <main className="game">
      <ControlsComponent
        picture={picture}
        region={region}
        view={view}
        setRegion={(id) => {
          setPicNum((n) => n + 1);
          setGuess(null);
          setStatus("start");
          setRegionId(id);
        }}
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
        cheatMode={cheatMode}
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

function useRegion(
  regions: Region[],
  initialRegionParam: RefObject<string | undefined>
): [Region | undefined, (_: string) => void] {
  let [current, setCurrent] = useState<string | undefined>(
    initialRegionParam.current ?? undefined
  );

  let region = current
    ? regions.find((r) => r.id === current) || regions[0]!
    : undefined;

  const initialDefault = useRef(regions[0]!.id);
  useEffect(() => {
    if (initialRegionParam.current) {
      return;
    }
    let stored = localStorage.getItem("region");
    if (stored) {
      setCurrent(stored);
    } else {
      setCurrent(initialDefault.current);
    }
  }, [initialRegionParam]);

  const setRegion = useCallback((id: string) => {
    setCurrent(id);
    localStorage.setItem("region", id);
  }, []);

  return [region, setRegion];
}
