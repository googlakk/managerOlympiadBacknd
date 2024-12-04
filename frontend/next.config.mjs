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
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY, // добавляем переменную окружения для API OpenAI
  },
  reactStrictMode: false,
};

export default nextConfig;
