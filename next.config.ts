import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  basePath: "/docs",
  reactStrictMode: true,
  allowedDevOrigins: ["localhost", "*.trycloudflare.com"],
  async rewrites() {
    return [
      {
        source: "/sdk/:path*",
        destination: "/api/sdk/:path*",
      },
    ];
  },
  async redirects() {
    const legacyRequest = {
      type: "host" as const,
      value: "docs.turboism.dev",
    };
    const gatewayRequest = {
      type: "query" as const,
      key: "__turboism_gateway",
      value: "1",
    };
    const legacyConditions = {
      basePath: false as const,
      has: [legacyRequest],
      missing: [gatewayRequest],
      permanent: true,
    };

    return [
      {
        source: "/sdk",
        destination: "/sdk/index.html",
        permanent: true,
      },
      {
        source: "/api/sdk/:path*",
        destination: "/sdk/:path*",
        permanent: true,
      },
      {
        source: "/api/sdk/:path*",
        destination: "https://turboism.dev/sdk/:path*",
        ...legacyConditions,
      },
      {
        source: "/docs",
        destination: "https://turboism.dev/docs",
        ...legacyConditions,
      },
      {
        source: "/docs/:path*",
        destination: "https://turboism.dev/docs/:path*",
        ...legacyConditions,
      },
      {
        source: "/:lang(en|zh|ja)/docs",
        destination: "https://turboism.dev/docs/:lang",
        ...legacyConditions,
      },
      {
        source: "/:lang(en|zh|ja)/docs/:path*",
        destination: "https://turboism.dev/docs/:lang/:path*",
        ...legacyConditions,
      },
      {
        source: "/:lang(en|zh|ja)",
        destination: "https://turboism.dev/docs/:lang",
        ...legacyConditions,
      },
      {
        source: "/:lang(en|zh|ja)/:path*",
        destination: "https://turboism.dev/docs/:lang/:path*",
        ...legacyConditions,
      },
      {
        source: "/",
        destination: "https://turboism.dev/docs",
        ...legacyConditions,
      },
      {
        source: "/:path*",
        destination: "https://turboism.dev/docs/:path*",
        ...legacyConditions,
      },
    ];
  },
  turbopack: { root: __dirname },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
