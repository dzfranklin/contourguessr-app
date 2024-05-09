import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useNavigate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return useMemo(
    () =>
      (
        update: (prev: {
          pathname: string;
          searchParams: Record<string, string>;
        }) => {
          pathname?: string;
          searchParams?: Record<string, string | undefined | null>;
        },
        options?: {
          replace?: boolean;
          scroll?: boolean;
        }
      ) => {
        const u = update({
          pathname,
          searchParams: Object.fromEntries(searchParams),
        });
        const uPathname = u.pathname || pathname;

        const uParams = new URLSearchParams();
        if (u.searchParams) {
          for (const [key, value] of Object.entries(u.searchParams)) {
            if (value === undefined || value === null) {
              continue;
            }
            uParams.set(key, value);
          }
        } else {
          for (const [key, value] of searchParams.entries()) {
            uParams.set(key, value);
          }
        }

        const full = uPathname + (uParams.size > 0 ? `?${uParams}` : "");
        console.log("Navigating to", full, options);
        if (options?.replace) {
          router.replace(full);
        } else {
          router.push(full);
        }
      },
    [router, searchParams, pathname]
  );
}
