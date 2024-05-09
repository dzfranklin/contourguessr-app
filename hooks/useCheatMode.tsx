import { useSearchParams } from "next/navigation";

export function useCheatMode() {
  const searchParams = useSearchParams();
  return searchParams.has("_cheat");
}
