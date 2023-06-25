/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "image.tmdb.org",
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

(module.exports = nextConfig), withBundleAnalyzer(nextConfig);
