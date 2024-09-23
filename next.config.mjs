/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,  },
    appDir: true,
  images: {
    domains: ['localhost', 'your-deployment-url.vercel.app'], // Add your deployment URL here
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
