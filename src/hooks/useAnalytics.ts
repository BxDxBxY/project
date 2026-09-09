import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/analytics/analytics";

/**
 * Hook to track page views automatically
 * Place in layout or root component
 */
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);
}

/**
 * Hook to access analytics tracking functions
 * Provides type-safe event tracking
 */
export function useAnalytics() {
  return {
    pageview,
    // Re-export all tracking functions from analytics.ts
    // This provides a convenient hook-based API
  };
}
