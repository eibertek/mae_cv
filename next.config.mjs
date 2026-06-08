/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Phaser uses browser globals — exclude from SSR bundle
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
