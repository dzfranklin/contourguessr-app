"use client";

import { Region } from "@/api/region";
import { createContext, useContext } from "react";

const RegionsContext = createContext<Region[]>([]);

export function RegionsProvider({
  children,
  value,
}: {
  children?: React.ReactNode;
  value: Region[];
}) {
  return (
    <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>
  );
}

export function useRegions() {
  return useContext(RegionsContext);
}
