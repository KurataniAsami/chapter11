import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.jp',
      },
      // rmjosghmcwpjirsmxyhxはsupabaseのプロジェクトid
      {
        protocol: 'https',
        hostname: 'rmjosghmcwpjirsmxyhx.supabase.co',
      },
    ],
  },
};

export default nextConfig;
