import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Next.js to trust your specific Replit URL for live-reloading
  allowedDevOrigins: [
    "45d48d6c-cadc-4821-b910-c1e00269c6d8-00-23zwt5dq05aci.spock.replit.dev",
    "localhost:3000"
  ],
};

export default nextConfig;