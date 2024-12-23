/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_STRAPI_URL
      }
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY, // добавляем переменную окружения для API OpenAI
  },
  reactStrictMode: false,
  productionBrowserSourceMaps: true
};

export default nextConfig;
