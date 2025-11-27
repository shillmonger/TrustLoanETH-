/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "fs": false,
      "net": false,
      "tls": false,
    };
    return config;
  },
};

module.exports = nextConfig;
