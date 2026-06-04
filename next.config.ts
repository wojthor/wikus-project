import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  // Payload admin (DndKit + useId) — mniej fałszywych błędów hydratacji w dev
  reactStrictMode: false,
  transpilePackages: [
    "payload",
    "@payloadcms/ui",
    "@payloadcms/next",
    "@payloadcms/richtext-lexical",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-developer-merchantid-domain-association",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "microphone=(self), camera=()",
          },
        ],
      },
    ];
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve ??= {};
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    // Nie aliasujemy "payload" — psuje to importy podścieżek (np. payload/shared).
    // @payloadcms/ui jest bezpośrednią zależnością w package.json.
    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

// true = poprawne ładowanie importMap (Lexical client) w dev; false powoduje błąd .call w /admin
export default withPayload(nextConfig, { devBundleServerPackages: true });
