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
        hostname: "ingenious-blessing-c1badf0d4b.media.strapiapp.com"
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
