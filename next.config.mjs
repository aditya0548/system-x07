/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei']
  }
};

export default nextConfig;
