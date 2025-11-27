// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     turbo: false,        // Fully disables Turbopack
//   },
//   webpack: (config) => {
//     return config;
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'why-is-node-running': false,
      fs: false,
      module: false,
    };
    return config;
  }
};

module.exports = nextConfig;
