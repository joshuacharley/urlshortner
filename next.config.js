/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ['localhost', 'your-deployment-url.vercel.app'], // Add your deployment URL here
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig