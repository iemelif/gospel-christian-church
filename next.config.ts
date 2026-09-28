import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // small self-contained build for the Docker image
};

export default nextConfig;
