import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard/products/:path*",
        destination: "/products/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/orders/:path*",
        destination: "/orders/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/categories/:path*",
        destination: "/categories/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
