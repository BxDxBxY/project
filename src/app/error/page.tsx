"use client";

// app/not-found.tsx (Next.js App Router, TypeScript)
// Also works as a standalone 404 page for a government-style website.

import Link from "next/link";

// export const metadata: Metadata = {
//   title: "404 — Page not found",
//   robots: { index: false, follow: false },
// };

export default function NotFound() {
  return (
    <main
      role="main"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#ffffff",
        color: "#0b1f33",
        padding: "24px",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <section
        aria-labelledby="nf-title"
        style={{
          width: "100%",
          maxWidth: "720px",
          border: "1px solid #d7dde3",
          borderRadius: "10px",
          padding: "28px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e6ebf0",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: "#0b3d91", // govt-blue
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            GOV
          </div>

          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: "14px", color: "#38536a" }}>
              Official Website
            </div>
            <h1
              id="nf-title"
              style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}
            >
              Page not found (404)
            </h1>
          </div>
        </header>

        {/* Body */}
        <div style={{ paddingTop: "18px" }}>
          <p style={{ margin: "0 0 12px 0", fontSize: "16px" }}>
            The page you requested could not be found. It may have been moved,
            renamed, or is temporarily unavailable.
          </p>

          <div
            style={{
              marginTop: "14px",
              padding: "14px",
              background: "#f6f8fa",
              border: "1px solid #e6ebf0",
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", color: "#274055" }}>
              <strong>Troubleshooting:</strong>
            </p>
            <ul style={{ margin: "10px 0 0 18px", color: "#274055" }}>
              <li>Check the web address for typing errors.</li>
              <li>Use the search to find the service or document.</li>
              <li>Return to the homepage and navigate from there.</li>
            </ul>
          </div>

          {/* Actions */}
          <nav
            aria-label="404 actions"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "18px",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#0b3d91",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Go to homepage
            </Link>

            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#0b3d91",
                border: "1px solid #0b3d91",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Contact support
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#0b1f33",
                border: "1px solid #d7dde3",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go back
            </button>
          </nav>

          {/* Optional: Search (client-side) */}
          <form
            action="/search"
            method="GET"
            role="search"
            aria-label="Site search"
            style={{ marginTop: "18px" }}
          >
            <label
              htmlFor="q"
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              Search this website
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Enter keywords"
                style={{
                  flex: "1 1 280px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d7dde3",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#0b1f33",
                  color: "#fff",
                  border: "1px solid #0b1f33",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Footer / compliance-style note */}
          <footer
            style={{
              marginTop: "18px",
              paddingTop: "14px",
              borderTop: "1px solid #e6ebf0",
              fontSize: "12px",
              color: "#5b7285",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "space-between",
            }}
          >
            <span>
              Error code: <strong>404</strong>
            </span>
            <span>
              If you believe this is an error, reference the URL and contact the
              website administrator.
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
