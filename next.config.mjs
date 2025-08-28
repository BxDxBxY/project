/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // ✅ Allow Next.js to build even with ESLint errors
      ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
  }
  
  module.exports = nextConfig