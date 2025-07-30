---
title: "Welcome to My Portfolio"
date: "2024-01-15"
description: "An introduction to my new portfolio website built with Next.js, featuring a modern blog system with MDX support."
type: "article"
tags: ["portfolio", "nextjs", "mdx", "web-development"]
draft: false
---

# Welcome to My Portfolio

Hello and welcome to my new portfolio website! I'm excited to share this space where I'll be posting about my projects, thoughts on web development, and various technical topics.

## What You'll Find Here

This portfolio is built with modern web technologies and includes several key features:

### 🚀 **Modern Tech Stack**
- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for beautiful, responsive styling
- **MDX** for rich, interactive blog content

### 📝 **Content Types**
I'll be sharing different types of content:

- **Blog Posts**: Technical articles, tutorials, and thoughts on development
- **Publications**: Academic papers, research, and formal articles
- **Projects**: Showcases of my work and open-source contributions

### ✨ **Features**

The blog system includes several powerful features:

1. **Markdown with React Components**: Thanks to MDX, I can embed interactive React components directly in my posts
2. **Syntax Highlighting**: Code blocks are beautifully highlighted with proper syntax coloring
3. **Math Support**: Mathematical equations are rendered with KaTeX: $E = mc^2$
4. **Tag-based Filtering**: Posts can be filtered by tags and content type
5. **SEO Optimized**: Every page includes proper metadata for search engines and social sharing

## Code Example

Here's a sample of what the code looks like behind this blog:

```typescript
// Example of a blog post component
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  return (
    <article className="prose-enhanced">
      <h1>{post.frontMatter.title}</h1>
      <MDXRemote source={post.content} options={post.options} />
    </article>
  );
}
```

## Mathematical Expressions

The blog supports both inline math like $\sqrt{x^2 + y^2}$ and display math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## What's Next?

I'm planning to write about:

- **React Patterns**: Advanced patterns and best practices
- **Performance Optimization**: Making web apps faster
- **TypeScript Tips**: Leveraging TypeScript for better code
- **Web Accessibility**: Building inclusive user experiences

## Get in Touch

Feel free to reach out if you have questions about any of the content here, want to collaborate on a project, or just want to chat about web development!

---

*This post demonstrates the capabilities of the new blog system. Check out the [source code](https://github.com/yourusername/portfolio) to see how it's built.* 