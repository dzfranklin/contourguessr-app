import { useSearchParams } from "next/navigation";

const defaultDFactor = 2.5;

export function useDFactor() {
  const searchParams = useSearchParams();
  const dFactor = searchParams.get("_d")
    ? parseFloat(searchParams.get("_d")!)
    : defaultDFactor;
  return dFactor;
}
