"use client";

import { Menu, Transition } from "@headlessui/react";
import { Region } from "@/api/region";
import { Fragment, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "@/classNames";

export default function RegionSelectorComponent({
  selected: selected,
  setSelected: setSelected,
  regions: regions,
}: {
  selected?: string;
  setSelected: (_: string | undefined) => void;
  regions: Region[];
}) {
  const sortedRegions = useMemo(
    () => regions.sort((a, b) => a.name.localeCompare(b.name)),
    [regions]
  );
  const selectedData = regions.find((region) => region.id === selected);

  return (
    <Menu as="div" className="relative inline-block text-left w-72">
      <div>
        <Menu.Button className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <span className="inline-flex gap-2 items-center font-semibold p-1">
            {selectedData?.logo_url && (
              <img
                src={selectedData.logo_url}
                alt=""
                className="h-8 max-w-10 rounded-sm"
              />
            )}
            <span>{selectedData?.name || "Any region"}</span>
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
          <SelectItem
            onClick={() => setSelected(undefined)}
            name="Any region"
            isSelected={!selected}
          />

          {sortedRegions.map((region) => (
            <SelectItem
              key={region.id}
              onClick={() => setSelected(region.id)}
              isSelected={region.id === selected}
              name={region.name}
              logoURL={region.logo_url}
            />
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function SelectItem({
  onClick,
  logoURL,
  name,
  isSelected,
}: {
  onClick: () => void;
  logoURL?: string;
  name: string;
  isSelected?: boolean;
}) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={classNames(
            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
            isSelected ? "font-semibold" : "",
            "w-full group flex gap-3 items-center px-6 py-6 text-sm"
          )}
        >
          <div className="h-10 w-10 flex items-center justify-end">
            {logoURL ? (
              <img src={logoURL} alt="" className="h-full rounded-sm" />
            ) : (
              <span className="h-full aspect-square" />
            )}
          </div>
          <span className="text-left">{name}</span>
        </button>
      )}
    </Menu.Item>
  );
}
