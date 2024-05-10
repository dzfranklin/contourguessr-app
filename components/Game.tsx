"use client";

import { useState } from "react";
import PictureComponent from "./Picture";
import ControlsComponent from "./Controls";
import MapComponent from "./Map";
import "./Game.css";
import computeResult from "@/logic/computeResult";
import { GameStatus } from "@/logic/GameStatus";
import { useChallenge } from "@/hooks/useChallenge";
import { useResults } from "@/hooks/useResults";
import { usePathname, useRouter } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import { useRegions } from "@/hooks/useRegions";

export default function GameComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = usePathname();
  const regions = useRegions();
  const [guess, setGuess] = useState<[number, number] | null>(null);
  const [results, pushResult] = useResults();
  const [status, setStatus] = useState<GameStatus>("start");
  const challenge = useChallenge();

  return (
    <main className="game">
      <ControlsComponent
        status={status}
        onGuess={() => {
          if (!guess) return;
          pushResult(computeResult(regions, challenge, guess));
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
                setGuess(null);
                setStatus("start");
                if (pathname === "/") {
                  router.refresh();
                } else {
                  navigate((p) => ({ ...p, pathname: "/" }));
                }
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
        status={status}
      />

      <PictureComponent showDescription={status === "done"} />
    </main>
  );
}
