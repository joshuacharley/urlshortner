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
      {
        source: "/expired/:shortCode",
        destination: "/expired/:shortCode",
      },
    ];
  },
};

export default nextConfig;
