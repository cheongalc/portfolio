import withMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  trailingSlash: true,
};

const mdxConfig = {
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
};

export default withMDX(mdxConfig)(nextConfig);
