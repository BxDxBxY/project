"use client";

import React, { useEffect } from "react";

/**
 * Last line of defence: an error thrown by the root layout itself.
 *
 * Next.js replaces the whole document here, so this file renders its own
 * <html>/<body> and may not use any provider, context or MUI component — none
 * of them have mounted. Plain markup and inline styles only, and the text is
 * Uzbek because the language context is exactly what is unavailable.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="uz">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "#001c3b",
          padding: "16px",
        }}
      >
        <main style={{ maxWidth: "28rem", textAlign: "center" }}>
          <div
            style={{
              width: "4px",
              height: "48px",
              margin: "0 auto 24px",
              background:
                "linear-gradient(180deg,#0099B5 0%,#c9a96e 50%,#1EB53A 100%)",
              borderRadius: "2px",
            }}
          />
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 12px" }}>
            Sayt vaqtincha ishlamayapti
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#475569",
              margin: "0 0 28px",
            }}
          >
            Kutilmagan xatolik yuz berdi. Sahifani yangilab koʻring — muammo
            takrorlansa, biroz vaqtdan soʻng qayta kiring.
          </p>
          <button
            onClick={() => reset()}
            style={{
              appearance: "none",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#001c3b",
              color: "#c9a96e",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "12px 28px",
              borderRadius: "12px",
            }}
          >
            Qayta urinish
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: "28px",
                fontSize: "0.72rem",
                color: "#94a3b8",
                fontFamily: "monospace",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
