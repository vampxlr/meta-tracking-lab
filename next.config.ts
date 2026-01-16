import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicitly set the workspace root to silence lockfile warning
  outputFileTracingRoot: path.join(__dirname, "./"),
};

export default nextConfig;
