/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      bundler: false, // disable turbopack, use webpack
    },
  },
};

module.exports = nextConfig;
