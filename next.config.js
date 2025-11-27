/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,        // ❗ Fully disables Turbopack
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
