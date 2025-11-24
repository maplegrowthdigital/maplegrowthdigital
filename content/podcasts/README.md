# Podcasts

This directory contains individual podcast episode files. Each podcast is a separate TypeScript file that exports a `Podcast` object.

## How to Add a New Podcast Episode

### 1. Create a New Podcast File

Create a new file in this directory with a descriptive slug name:

```
content/podcasts/your-episode-slug.ts
```

### 2. Use This Template

Copy and paste this template into your new file:

```typescript
import { Podcast } from "../podcasts";

export const podcast: Podcast = {
  slug: "your-episode-slug",
  title: "Episode Title Here",
  episodeNumber: 1, // Optional
  date: "2024-MM-DD", // ISO date format
  host: "Your Name",
  guests: ["Guest 1", "Guest 2"], // Optional
  excerpt: "A brief 1-2 sentence description of the episode.",
  coverImage: "/images/podcast-cover.jpg", // Optional
  audioUrl: "https://your-audio-host.com/episode.mp3", // Required
  duration: "45:30", // Optional (MM:SS format)
  tags: ["tag1", "tag2", "tag3"], // Optional
  showNotes: `## Show Notes

### Topics Covered
- Topic 1
- Topic 2
- Topic 3

### Resources Mentioned
- [Resource 1](https://example.com)
- [Resource 2](https://example.com)

### Timestamps
- 00:00 - Introduction
- 05:30 - Topic 1
- 20:15 - Topic 2
- 35:00 - Q&A
`,
  transcript: `## Full Transcript

**Host:** Welcome to the show...

**Guest:** Thanks for having me...

[Full transcript here]
`, // Optional
  spotifyUrl: "https://open.spotify.com/episode/...", // Optional
  applePodcastsUrl: "https://podcasts.apple.com/...", // Optional
  youtubeUrl: "https://youtube.com/watch?v=...", // Optional
};
```

### 3. Register the Podcast

Open `content/podcasts.ts` and add your new podcast:

**Step 1:** Import your podcast at the top:

```typescript
import { podcast as yourEpisodeName } from "./podcasts/your-episode-slug";
```

**Step 2:** Add it to the podcasts array:

```typescript
export const podcasts: readonly Podcast[] = [
  yourEpisodeName, // Add your podcast here
];
```

### 4. Done!

Your podcast will now appear in the blog/podcast listing automatically. Episodes are sorted by date (newest first).

## Podcast Object Properties

| Property           | Type     | Required | Description                        |
| ------------------ | -------- | -------- | ---------------------------------- |
| `slug`             | string   | ✅       | URL-friendly identifier            |
| `title`            | string   | ✅       | Episode title                      |
| `episodeNumber`    | number   | ❌       | Episode number in series           |
| `date`             | string   | ✅       | ISO date format (YYYY-MM-DD)       |
| `host`             | string   | ❌       | Host name                          |
| `guests`           | string[] | ❌       | Array of guest names               |
| `excerpt`          | string   | ✅       | Short description for listings     |
| `coverImage`       | string   | ❌       | Path to episode artwork            |
| `audioUrl`         | string   | ✅       | URL to audio file (MP3, etc.)      |
| `duration`         | string   | ❌       | Episode length (e.g., "45:30")     |
| `tags`             | string[] | ❌       | Topics/categories                  |
| `showNotes`        | string   | ❌       | Markdown show notes                |
| `transcript`       | string   | ❌       | Full transcript (Markdown)         |
| `spotifyUrl`       | string   | ❌       | Spotify episode link               |
| `applePodcastsUrl` | string   | ❌       | Apple Podcasts link                |
| `youtubeUrl`       | string   | ❌       | YouTube video link (if applicable) |

## Audio Hosting

You'll need to host your audio files. Popular options:

1. **Buzzsprout** - Easy podcast hosting with analytics
2. **Anchor/Spotify** - Free hosting with distribution
3. **Transistor** - Professional hosting platform
4. **Simplecast** - Advanced analytics and hosting
5. **Self-hosted** - Host MP3 files on your own server/CDN

The `audioUrl` should be a direct link to the MP3 file.

## Show Notes Tips

### Structure

Good show notes include:

- **Overview** - What the episode is about
- **Topics Covered** - Bullet list of main topics
- **Resources Mentioned** - Links to books, tools, websites
- **Timestamps** - Help listeners jump to specific sections
- **Guest Info** - Bio and links for guests
- **Call to Action** - How to subscribe, leave reviews, etc.

### Example Show Notes Format

```markdown
## Episode Overview

In this episode, we discuss...

## Topics Covered

- How to start a podcast
- Equipment recommendations
- Editing workflows
- Distribution strategies

## Resources Mentioned

- [Microphone we recommend](https://example.com)
- [Editing software](https://example.com)
- [Guest's website](https://example.com)

## Timestamps

- 00:00 - Introduction
- 05:30 - Equipment recommendations
- 20:15 - Editing tips
- 35:00 - Distribution strategies
- 42:00 - Q&A and wrap-up

## Connect With Us

- Subscribe on [Spotify](https://spotify.com)
- Subscribe on [Apple Podcasts](https://apple.com)
- Follow us on [Twitter](https://twitter.com)
```

## Transcript Tips

### Why Include Transcripts?

- **Accessibility** - Helps deaf/hard-of-hearing users
- **SEO** - Search engines can index your content
- **Skimmability** - Readers can quickly find topics
- **Repurposing** - Easy to create blog posts from transcripts

### Transcript Services

- **Otter.ai** - Automated transcription with AI
- **Rev.com** - Human transcription (high accuracy)
- **Descript** - Transcription + audio editing
- **YouTube** - Auto-generates captions/transcripts

### Format

Use speaker labels and timestamps:

```markdown
## Full Transcript

**[00:00] Host:** Welcome to the show! Today we're talking about...

**[00:30] Guest:** Thanks for having me. I'm excited to discuss...

**[02:15] Host:** Let's start with your background...
```

## Distribution Platforms

### Submitting Your Podcast

Once you have episodes, submit to:

- **Apple Podcasts** - Largest platform, required RSS feed
- **Spotify** - Growing platform, direct upload available
- **Google Podcasts** - Automatic via RSS feed
- **Amazon Music** - Submit via Podcasts Connect
- **YouTube** - Convert to video or upload audio with static image

### RSS Feed

Most platforms require an RSS feed. Your podcast host (Buzzsprout, Anchor, etc.) will generate this automatically.

## SEO for Podcasts

1. **Descriptive Titles** - Include main keywords naturally
2. **Compelling Excerpts** - Make people want to listen
3. **Tags** - Use relevant topics for categorization
4. **Show Notes** - Rich content helps with SEO
5. **Transcripts** - Full text content is SEO gold

## Integration with Blog

Podcasts appear alongside blog posts on the `/blog` page. They're distinguished by:

- 🎙️ Podcast icon
- Episode number badge
- Duration display
- Play button link

Each podcast has its own dedicated page at `/podcast/[slug]` (we'll set this up when you're ready).

## Need Help?

Refer to existing podcast files as templates or check the main documentation for content management.
