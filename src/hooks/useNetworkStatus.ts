"use client";

import { useEffect, useState } from "react";

export interface NetworkStatus {
  /** `false` only when the browser is certain there is no connection. */
  online: boolean;
  /** True for a few seconds right after the connection comes back. */
  justReconnected: boolean;
  /** True on 2g/slow-2g, or when the user asked for reduced data use. */
  slow: boolean;
}

type ConnectionLike = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

const readConnection = (): ConnectionLike | undefined => {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as unknown as { connection?: ConnectionLike }).connection;
};

const readSlow = (): boolean => {
  const connection = readConnection();
  if (!connection) return false;
  if (connection.saveData) return true;
  return (
    connection.effectiveType === "2g" || connection.effectiveType === "slow-2g"
  );
};

/**
 * Connection state for the interface.
 *
 * Deliberately starts optimistic (`online: true`): the server render has no
 * navigator, and flashing an offline banner during hydration on a perfectly
 * good connection is worse than a moment's delay before showing a real one.
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [online, setOnline] = useState(true);
  const [justReconnected, setJustReconnected] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine !== false);
    sync();
    setSlow(readSlow());

    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleOnline = () => {
      setOnline(true);
      setJustReconnected(true);
      timer = setTimeout(() => setJustReconnected(false), 4000);
    };
    const handleOffline = () => {
      setOnline(false);
      setJustReconnected(false);
    };
    const handleConnectionChange = () => setSlow(readSlow());

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection = readConnection();
    connection?.addEventListener?.("change", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      connection?.removeEventListener?.("change", handleConnectionChange);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return { online, justReconnected, slow };
};
