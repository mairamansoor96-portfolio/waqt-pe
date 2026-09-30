import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no server, no server functions. Builds to `out/`.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
