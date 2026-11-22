import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ] }, {
      // Config headers also override Route Handler headers: preserve the token page's stricter policy.
      source: "/unsubscribe",
      headers: [
        { key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    }];
  },
  // fonts read with fs at runtime by the share-image routes
  outputFileTracingIncludes: { "/item/[slug]/*": ["./assets/fonts/**", "./public/img/**"], "/opengraph-image": ["./assets/fonts/**", "./public/img/**"], "/t/[slug]": ["./public/img/**"] },
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
