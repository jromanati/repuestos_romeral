/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',  // 👈 ESTE es el importante
      'blob.v0.dev',
      'placeholder.svg',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // 👈 y esto también ayuda
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
