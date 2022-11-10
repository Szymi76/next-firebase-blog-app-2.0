/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "encrypted-tbn0.gstatic.com",
      "cdn.corporate.walmart.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
