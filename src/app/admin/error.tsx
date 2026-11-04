"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

/**
 * Route-level boundary for the editorial panel.
 *
 * Shown instead of a white screen when a panel page throws — the editor keeps
 * their session and can retry without signing in again.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <ErrorState error={error} onRetry={reset} />
    </div>
  );
}
