/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.scdn.co"], // agrega aquí los hostnames permitidos
  },
};

export default nextConfig;
