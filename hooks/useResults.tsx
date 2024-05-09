"use client";
import { useEffect, useState } from "react";
import { GameResult } from "@/logic/computeResult";

export function useResults(): [GameResult[], (_: GameResult) => void] {
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
