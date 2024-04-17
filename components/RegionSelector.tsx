"use client";

import { Menu, Transition } from "@headlessui/react";
import { Region } from "@/api/region";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "@/classNames";

export default function RegionSelectorComponent({
  selected: selected,
  setSelected: setSelected,
  regions: regions,
}: {
  selected?: string;
  setSelected: (_: string) => void;
  regions: Region[];
}) {
  const selectedData = regions.find((region) => region.id === selected);

  return (
    <Menu as="div" className="relative inline-block text-left w-72">
      <div>
        <Menu.Button className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <span className="inline-flex gap-2 items-center font-semibold">
            {selectedData ? (
              selectedData.logo ? (
                <img
                  src={selectedData.logo}
                  alt=""
                  className="h-8 max-w-10 rounded-sm"
                />
              ) : (
                <span className="h-8 w-8" />
              )
            ) : (
              <span className="h-8 w-8 bg-gray-200 rounded-sm" />
            )}
            <span>{selectedData?.name || "Select region"}</span>
          </span>

          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-[25rem] max-h-[60vh] overflow-y-scroll origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {regions.map((region) => (
            <Menu.Item key={region.id}>
              {({ active }) => (
                <button
                  onClick={() => setSelected(region.id)}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "w-full group flex gap-3 items-center px-6 py-6 text-sm"
                  )}
                >
                  <div className="h-10 w-10 flex items-center justify-end">
                    {region.logo ? (
                      <img
                        src={region.logo}
                        alt=""
                        className="h-full rounded-sm"
                      />
                    ) : (
                      <span className="h-full aspect-square" />
                    )}
                  </div>
                  <span>{region.name}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
