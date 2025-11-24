# Blog Posts

This directory contains individual blog post files. Each post is a separate TypeScript file that exports a `Post` object.

## How to Add a New Blog Post

### 1. Create a New Post File

Create a new file in this directory with a descriptive slug name:

```
content/posts/your-post-slug.ts
```

### 2. Use This Template

Copy and paste this template into your new file:

```typescript
import { Post } from "../posts";

export const post: Post = {
  slug: "your-post-slug",
  title: "Your Post Title Here",
  date: "2024-MM-DD", // ISO date format
  author: "MapleGrowth Team",
  excerpt: "A brief 1-2 sentence description that appears in post listings.",
  coverImage: "/images/your-image.jpg", // Optional
  tags: ["tag1", "tag2", "tag3"], // Optional
  content: [
    "Optional array of short paragraphs for preview",
    "Each item is a separate paragraph",
  ],
  contentMd: `## Your Main Content Here

Write your full blog post content in Markdown format.

### Section 1

Your content here...

### Section 2

More content...

## Conclusion

Final thoughts...
`,
};
```

### 3. Register the Post

Open `content/posts.ts` and add your new post:

**Step 1:** Import your post at the top:

```typescript
import { post as yourPostName } from "./posts/your-post-slug";
```

**Step 2:** Add it to the posts array:

```typescript
export const posts: readonly Post[] = [
  aiInDigitalMarketing,
  craftingFastSites,
  designSystems,
  seoFoundations,
  yourPostName, // Add your post here
];
```

### 4. Done!

Your post will now appear in the blog automatically. Posts are sorted by date (newest first).

## Post Object Properties

| Property     | Type     | Required | Description                                     |
| ------------ | -------- | -------- | ----------------------------------------------- |
| `slug`       | string   | ✅       | URL-friendly identifier (e.g., "my-post-title") |
| `title`      | string   | ✅       | Display title of the post                       |
| `date`       | string   | ✅       | ISO date format (YYYY-MM-DD)                    |
| `author`     | string   | ❌       | Author name (default: "MapleGrowth Team")       |
| `excerpt`    | string   | ✅       | Short description for listings and SEO          |
| `coverImage` | string   | ❌       | Path to cover image                             |
| `tags`       | string[] | ❌       | Array of tags for categorization                |
| `content`    | string[] | ❌       | Array of preview paragraphs                     |
| `contentMd`  | string   | ❌       | Full Markdown content                           |
| `audioUrl`   | string   | ❌       | URL to podcast/audio version                    |

## Content Writing Tips

### Use Markdown for Full Content

The `contentMd` field supports full Markdown syntax:

- **Headings:** `## Heading 2`, `### Heading 3`
- **Bold:** `**bold text**`
- **Italic:** `*italic text*`
- **Lists:** `* item` or `- item`
- **Links:** `[text](url)`
- **Code blocks:** ` ```language \n code \n ``` `
- **Images:** `![alt text](image-url)`

### SEO Best Practices

1. **Title:** Keep it under 60 characters, include main keyword
2. **Excerpt:** 150-160 characters, compelling and descriptive
3. **Tags:** 3-5 relevant tags for categorization
4. **Content:** Use proper heading hierarchy (H2, H3, etc.)
5. **Keywords:** Use naturally, no stuffing
6. **Length:** 1,500-3,000 words for comprehensive coverage

### Writing Style

- **Conversational tone:** Write like you're talking to a colleague
- **Use examples:** Real-world scenarios help readers understand
- **Break up text:** Short paragraphs, bullet points, subheadings
- **Include emojis:** Tasteful use can improve readability (🎯 ✅ 👉)
- **Add code snippets:** When relevant, show practical examples
- **End with takeaways:** Summarize key points

## Example Posts

Check these existing posts for reference:

- `ai-in-digital-marketing-2025.ts` - Comprehensive guide format
- `crafting-fast-accessible-sites.ts` - Technical how-to format
- `design-systems-that-scale.ts` - Strategic advice format
- `seo-foundations-for-2024.ts` - Best practices format

## Need Help?

If you have questions about the post format or Markdown syntax, refer to existing posts as templates or check the [Markdown Guide](https://www.markdownguide.org/).
