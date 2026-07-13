// GitHub Pages 部署在 https://<user>.github.io/<repo>/ 子路径下，
// 由 CI 通过 NEXT_PUBLIC_BASE_PATH 注入仓库名作为 basePath。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default nextConfig;
