import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Adding these hostnames allows Next.js app to safely load and
  // optimize images from Replicate and Supabase project.
  // This ensures images from these external sources are processed by
  // Next.js's built-in Image Optimization for better performance and security.
  images: {
    remotePatterns: [
      // AI image generator - Output files are served via replicate.delivery and its subdomains
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      // DB col - imgUrl
      {
        protocol: 'https',
        hostname: 'jpjlymjcepusgaybhkqz.supabase.co',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [process.env.LOCAL_WEB_HOOK!],
  },
};

export default nextConfig;
