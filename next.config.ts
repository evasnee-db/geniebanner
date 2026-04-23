import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid inferring a parent directory as the app root when another lockfile exists above the repo.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
