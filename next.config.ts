import withMDX from "@next/mdx";

const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const mdxConfig = {
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
};

export default withMDX(mdxConfig)(nextConfig);
