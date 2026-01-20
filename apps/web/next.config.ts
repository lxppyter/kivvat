import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false, // Disable source maps in production
  poweredByHeader: false, // Hide X-Powered-By header
  reactStrictMode: true,
};

export default nextConfig;
