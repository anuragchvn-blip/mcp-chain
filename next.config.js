/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure all dependencies are bundled for serverless
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js', 'ethers'],
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;
