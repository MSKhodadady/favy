/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      //: liara
      {
        protocol: "https",
        hostname: "**.liara.**",
      },

      //: localhost
      {
        hostname: "localhost",
      },
    ],
  },
};

module.exports = nextConfig;
