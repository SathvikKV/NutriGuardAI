/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", //  any call to /api/xyz
        destination: "http://localhost:8000/api/:path*", //  forwards to FastAPI backend
      },
    ];
  },
};

export default nextConfig;
