import { Region } from "@/api/region";
import RegionSelectorComponent from "./RegionSelector";
import classNames from "@/classNames";
import { GameStatus } from "@/logic/GameStatus";
import { useState } from "react";
import StatsModal from "./StatsModal";
import { GameResult } from "@/logic/computeResult";
import LinkIcon from "@heroicons/react/20/solid/LinkIcon";
import { useRegions } from "@/hooks/useRegions";
import { useChallenge } from "@/hooks/useChallenge";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ControlsComponent({
  status,
  onGuess,
  results,
}: {
  status: GameStatus;
  onGuess: () => void;
  results: GameResult[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("r") || undefined;
  const { data, region, view } = useChallenge();
  const regions = useRegions();
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="col-span-full flex flex-col mx-4 mt-4 mb-2">
      <div className="flex flex-row gap-3 items-center mb-1">
        <div className="mr-3">
          <RegionSelectorComponent
            selected={selectedRegion}
            setSelected={(id) => {
              let url = "/";
              if (id) {
                url += `?r=${id}`;
              }

              if (pathname === "/") {
                router.replace(url.toString());
              } else {
                router.push(url.toString());
              }
            }}
            regions={regions}
          />
        </div>

        <button
          type="button"
          className="rounded-full p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 bg-white hover:bg-gray-50"
          title="Copy the link to this challenge"
          onClick={() => {
            const url = new URL(window.location.href);
            url.pathname = `/c/${data.id}`;
            navigator.clipboard.writeText(url.toString());
            toast.success("Link copied to clipboard");
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
          Near {view.center[1].toFixed(4)}, {view.center[0].toFixed(4)}
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
