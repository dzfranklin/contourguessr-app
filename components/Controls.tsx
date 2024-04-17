import { Region } from "@/api/region";
import RegionSelectorComponent from "./RegionSelector";
import classNames from "@/classNames";
import { GameStatus } from "@/logic/GameStatus";
import { useState } from "react";
import StatsModal from "./StatsModal";
import { GameResult } from "@/logic/computeResult";
import LinkIcon from "@heroicons/react/20/solid/LinkIcon";
import { Picture } from "@/api/picture";
import { GameView } from "@/logic/computeView";

export default function ControlsComponent({
  picture,
  region,
  view,
  setRegion,
  regions,
  status,
  onGuess,
  results,
}: {
  picture?: Picture;
  region?: Region;
  view?: GameView;
  setRegion: (value: string) => void;
  regions: Region[];
  status: GameStatus;
  onGuess: () => void;
  results: GameResult[];
}) {
  const [showStats, setShowStats] = useState(false);
  return (
    <div className="col-span-full flex flex-col mx-4 mt-4 mb-2">
      <div className="flex flex-row gap-3 items-center mb-1">
        <div className="mr-3">
          <RegionSelectorComponent
            selected={region?.id}
            setSelected={setRegion}
            regions={regions}
          />
        </div>

        <button
          type="button"
          className="rounded-full p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50"
          title="Copy the link to this challenge"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set("r", region?.id || "");
            url.searchParams.set("p", picture?.id || "");
            navigator.clipboard.writeText(url.toString());
          }}
        >
          <LinkIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="ml-auto" />

        <button className="text-sm link" onClick={() => setShowStats(true)}>
          My stats
        </button>

        {(status === "start" || status === "guessing") && (
          <button
            className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0 disabled:shadow-none"
            disabled={status !== "guessing"}
            onClick={() => onGuess()}
          >
            Guess
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          Tip: Hold down Alt+Shift and drag to rotate
        </div>
        <div className="text-sm text-gray-500">
          {view && (
            <>
              Near {view.center[1].toFixed(4)}, {view.center[0].toFixed(4)}
            </>
          )}
        </div>
      </div>

      <StatsModal
        isOpen={showStats}
        close={() => setShowStats(false)}
        results={results}
      />
    </div>
  );
}

function ControlButton({
  onClick,
  className,
  disabled,
  children,
}: {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode | React.ReactNode[] | string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0 disabled:shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
}
