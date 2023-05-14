/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "firebasestorage.googleapis.com", "cdn.sanity.io"],
  },
};

module.exports = nextConfig;