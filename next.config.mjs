/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    // Empty config to acknowledge Turbopack usage
    resolveAlias: {},
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // HSTS - only enable in production with HTTPS
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
          {
            key: "Content-Security-Policy",
            value:
              process.env.NODE_ENV === "production"
                ? [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com",
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                    "img-src 'self' data: https: blob:",
                    "font-src 'self' data: https://fonts.gstatic.com",
                    "connect-src 'self' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://dip-lugat.uz",
                    "frame-src https://www.google.com",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self'",
                    "frame-ancestors 'none'",
                  ].join("; ")
                : [
                    // More permissive CSP for development
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com",
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                    "img-src 'self' data: https: http: blob:",
                    "font-src 'self' data: https://fonts.gstatic.com",
                    "connect-src 'self' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://dip-lugat.uz http://localhost:* http://127.0.0.1:* ws://localhost:*",
                    "frame-src https://www.google.com",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self'",
                    "frame-ancestors 'none'",
                  ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
