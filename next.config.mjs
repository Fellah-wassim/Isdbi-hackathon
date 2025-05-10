/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors at build time
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors at build time
  },
};

export default config;
