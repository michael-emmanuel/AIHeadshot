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
    allowedDevOrigins: [
      'https://4228-2600-1700-4cb0-2ed0-e4ee-2db4-4eb2-1937.ngrok-free.app',
    ],
  },
};

export default nextConfig;
