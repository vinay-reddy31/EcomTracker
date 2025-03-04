/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // Keep if needed
  },
  serverExternalPackages: ["mongoose"], // Keep this
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

module.exports = nextConfig;
