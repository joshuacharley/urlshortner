/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/:shortCode",
        destination: "/api/redirect/:shortCode",
      },
    ];
  },
};

export default nextConfig;
