/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/SpatialBrick";

    return [
      {
        source: "/rest/:path*",
        destination: `${apiBaseUrl}/rest/:path*`,
      },
    ];
  },
};

export default nextConfig;
