import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project so stray lockfiles in parent
    // directories cannot make Turbopack infer the wrong root.
    root: path.join(__dirname),
  },
};

export default nextConfig;
