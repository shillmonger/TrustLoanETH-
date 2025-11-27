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


module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'why-is-node-running': false,
      fs: false,
      module: false,
    };
    return config;
  },

  // 🔥 FORCE Next.js to use Webpack instead of Turbopack
  experimental: {
    webpackBuildWorker: true,
  },
};
