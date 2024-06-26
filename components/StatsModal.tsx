import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { GameResult } from "@/logic/computeResult";
import * as Plot from "@observablehq/plot";

export default function StatsModalComponent({
  results,
  isOpen,
  close,
}: {
  results: GameResult[];
  isOpen: boolean;
  close: () => void;
}) {
  let average: number | undefined;
  let median: number | undefined;
  let best: number | undefined;
  let worst: number | undefined;
  if (results.length > 0) {
    const distances = results.map((r) => r.distance);
    distances.sort((a, b) => a - b);
    average = distances.reduce((a, b) => a + b, 0) / distances.length;
    median = distances[Math.floor(distances.length / 2)];
    best = distances[0];
    worst = distances[distances.length - 1];
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => close()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-10">
                  <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-5 md:divide-x md:divide-y-0">
                    <StatComponent
                      name="Challenges"
                      value={results.length.toString()}
                    />
                    <StatComponent name="Average" value={average?.toFixed(0)} />
                    <StatComponent name="Median" value={median?.toFixed(0)} />
                    <StatComponent name="Best" value={best?.toFixed(0)} />
                    <StatComponent name="Worst" value={worst?.toFixed(0)} />
                  </dl>

                  <StatChartComponent results={results} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function StatComponent({ name, value }: { name: string; value?: string }) {
  return (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">{name}</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          {value}
        </div>
      </dd>
    </div>
  );
}

function StatChartComponent({ results }: { results: GameResult[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const data = results.map((r) => ({
    Region: r.region_name,
    Date: new Date(r.ts),
    Distance: r.distance,
  }));

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    resizeObserver.observe(containerRef.current!);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const plot = Plot.plot({
      height: 400,
      width,
      inset: 8,
      grid: true,
      color: {
        legend: true,
      },
      marks: [
        Plot.ruleY([0]),
        Plot.axisY({
          label: "Distance (m)",
        }),
        Plot.axisX({
          label: "Date",
        }),
        Plot.dot(data, {
          x: "Date",
          y: "Distance",
          fill: "Region",
          tip: true,
        }),
      ],
    });
    containerRef.current?.append(plot);
    return () => plot.remove();
  }, [width, data]);
  return <div ref={containerRef} className="mt-10 w-full" />;
}
