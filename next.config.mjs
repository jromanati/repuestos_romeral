/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    // pdfkit carga las fuentes estándar con require() dinámico; sin esto
    // los .cjs no llegan al bundle de la función serverless en Vercel
    "/api/catalog/pdf": ["./node_modules/**/pdfkit/**"],
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
