/** @type {import('next').NextConfig} */
const isProd =
  process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

// Build a permissive CSP that still blocks obvious nonsense.
// Scheme-wide allows (https:, data:, blob:) keep experiments working.
// 'unsafe-eval' only in dev for Next HMR. JSON-LD needs 'unsafe-inline' unless you add nonces/hashes.
const cspDirectives = {
  "default-src": ["'self'", "https:", "data:", "blob:"],
  "script-src": ["'self'", "'unsafe-inline'", ...(isProd ? [] : ["'unsafe-eval'"]), "https:", "blob:"],
  "style-src": ["'self'", "'unsafe-inline'", "https:"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'", "https:", "wss:"],     // SDK beacons, APIs, websockets
  "media-src": ["'self'", "https:", "blob:"],
  "frame-src": ["https:"],                          // allow iframes from any https origin
  "frame-ancestors": ["'self'"],                    // your site can't be iframed by others
  "base-uri": ["'self'"],
  "form-action": ["'self'"]
};

// Optional: quickly allow extra hosts without editing code
// e.g. CSP_EXTRA="https://www.googletagmanager.com,https://www.google-analytics.com"
const extra = (process.env.CSP_EXTRA || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
if (extra.length) {
  cspDirectives["script-src"].push(...extra);
  cspDirectives["connect-src"].push(...extra);
}

const csp = Object.entries(cspDirectives)
  .map(([k, v]) => `${k} ${Array.from(new Set(v)).join(" ")}`)
  .join("; ");

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },

          // Sensible, low-drama security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },

          // Leave COOP/COEP off unless you need cross-origin isolation (they break many third-party assets)
          // { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          // { key: "Cross-Origin-Resource-Policy", value: "same-origin" },

          // Only index in prod; previews/dev stay noindex
          ...(isProd
            ? [{ key: "X-Robots-Tag", value: "index, follow" }]
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
