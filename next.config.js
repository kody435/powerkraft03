/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "image.tmdb.org",
      "cdn.sanity.io",
    ],
  },
};

module.exports = nextConfig;
