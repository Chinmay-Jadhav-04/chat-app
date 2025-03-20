/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil"
    });
    return config;
  },
  images: {
    domains: [
      "img.clerk.com",
      // Add any other domains you need for images
    ]
  }
};
