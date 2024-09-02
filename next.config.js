const DIRECTUS_PROTOCOL = /** @type {"http" | "https"} */ (
  process.env.DIRECTUS_PROTOCOL ?? "http"
);
const DIRECTUS_HOSTNAME = process.env.DIRECTUS_HOSTNAME ?? "";
if (DIRECTUS_HOSTNAME == "") throw Error("No directus hostname in env.");

const DIRECTUS_PORT = process.env.DIRECTUS_PORT ?? "8055";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: DIRECTUS_PROTOCOL,
        hostname: DIRECTUS_HOSTNAME,
        port: DIRECTUS_PORT,
      },
    ],
  },
};

module.exports = nextConfig;
