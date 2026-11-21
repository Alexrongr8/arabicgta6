import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // fonts read with fs at runtime by the share-image routes
  outputFileTracingIncludes: { "/item/[slug]/*": ["./assets/fonts/**", "./public/img/**"], "/t/[slug]": ["./public/img/**"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
