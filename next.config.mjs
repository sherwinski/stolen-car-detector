/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BLOB_BUCKET_HOSTNAME,
      },
    ],
    deviceSizes: [240, 540, 720],
  },
}

export default nextConfig
