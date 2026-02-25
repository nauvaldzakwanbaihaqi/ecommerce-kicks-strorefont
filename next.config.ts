import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com', // 👈 Izinkan gambar dari GitHub
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // 👈 Jaga-jaga kalau nanti pake Google Login
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 👈 Jaga-jaga kalau pake Unsplash
      }
    ],
  },
};

export default nextConfig;
