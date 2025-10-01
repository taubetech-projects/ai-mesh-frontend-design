/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 👈 disable React Strict Mode
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
