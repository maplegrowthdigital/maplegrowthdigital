# Agency Website Template - Setup Guide

This guide will help you customize this template for your agency in just a few steps.

## Quick Start (5 minutes)

### 1. Basic Information

Edit `content/site.ts` and update these key fields:

```typescript
export const site = {
  // Your logo (place in /public/)
  logoUrl: "/your-logo.png",

  // Your booking link (Calendly, TidyCal, etc.)
  tidycal: "https://calendly.com/your-link",

  // Hero section
  hero: {
    title: "Your Agency Headline",
    subhead: "Your Value Proposition",
    body: "Brief description of what you do...",
    // Update your stats
    stats: [
      { value: "X+ yrs", label: "Experience" },
      { value: "XX+", label: "Projects delivered" },
      // ...
    ],
  },

  // Contact information
  contact: {
    email: "hello@youragency.com",
    phone: "+1 (555) 123-4567",
    location: "Your Location",
  },
};
```

### 2. Brand Settings

**Option A: Through Admin Panel (Recommended)**

1. Run `npm run dev`
2. Visit `/admin` and login
3. Go to the "Brand" section
4. Use the "Brand" section to:
   - Pick a color with the color picker
   - Choose from preset colors
   - Enter a hex code directly
   - (Optional) Set a dedicated primary button color — leave blank to reuse the brand color
   - Update the site font stack (for example `"Inter", sans-serif`)
   - Headings default to Montserrat while body copy uses Open Sans
5. Save settings - colors update immediately!

**Option B: Manual Configuration**
Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        500: '#your-brand-color' // Replace with your brand color
      }
    }
  }
}
```

**Note**: Admin panel method is preferred as it allows real-time updates without code modifications. If you switch fonts, be sure the font is loaded on the site (via Google Fonts, self-hosted files, etc.).

### 3. Replace Images

Replace these files in `/public/`:

- `/logo.png` - Your logo
- `/images/hero-graphic.svg` - Hero image
- `/about/team-photo.jpg` - Team photo
- `/logos/client-*.jpg` - Client logos

### 4. Test Your Changes

```bash
npm run dev
```

Visit `http://localhost:3000` to see your changes.

## Detailed Customization

### Services Section

Update your service offerings in `content/site.ts`:

```typescript
services: {
  title: "What we offer",
  subtitle: "Your services description...",
  items: [
    {
      icon: "DESIGN", // Icon identifier
      title: "Service Name",
      description: "Service description..."
    },
    // Add more services...
  ]
}
```

### Case Studies / Portfolio

Add your projects:

```typescript
caseStudies: {
  items: [
    {
      slug: "project-url-slug",
      title: "Project Name",
      category: "Project Type",
      summary: "Brief project description...",
      image: "/case/project-image.jpg",
      results: ["Result 1", "Result 2", "Result 3"],
      link: "https://project-url.com",
    },
  ];
}
```

### Team/About Section

Update your team information:

```typescript
about: {
  title: "About Our Team",
  body: "Your company story...",
  highlights: [
    "Your key differentiator 1",
    "Your key differentiator 2",
    // ...
  ],
  ceoNote: "Personal note from founder/CEO...",
  ceoName: "Your Name",
  ceoTitle: "Your Title",
  photo: "/about/your-photo.jpg"
}
```

## Advanced Setup

### Admin Panel (Optional)

To enable dynamic content editing:

1. **Create Supabase Project**:

   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get your project URL and API keys

2. **Environment Variables**:
   Create `.env.local`:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   ADMIN_USER=your_admin_username
   ADMIN_PASS=your_admin_password
   ```

3. **Database Setup**:
   Run these SQL commands in Supabase SQL editor:

   ```sql
   -- Create sections table for dynamic content
   CREATE TABLE sections (
     id TEXT PRIMARY KEY,
     data JSONB NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create posts table for blog
   CREATE TABLE posts (
     slug TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     excerpt TEXT,
     content_md TEXT,
     cover_image TEXT,
     author TEXT,
     tags TEXT[],
     date DATE,
     published BOOLEAN DEFAULT false,
     audio_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create storage bucket for uploads
   INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
   ```

4. **Access Admin Panel**:
   - Visit `/admin` on your site
   - Login with your admin credentials
   - Edit content dynamically

### Blog Setup

With admin panel enabled:

1. Visit `/admin` and click "Posts"
2. Create new blog posts with markdown
3. Upload images and media
4. Publish when ready

### SEO Configuration

In the admin panel under "Settings":

- Set site title and description
- Upload favicon and social media images
- Configure JSON-LD schema for better SEO

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

1. Build: `npm run build`
2. Start: `npm start`
3. Set environment variables on your platform

## Customization Tips

### Colors and Branding

- Primary brand color: `tailwind.config.js`
- Update CSS custom properties in `app/globals.css` if needed
- Replace all placeholder images with your own

### Content Strategy

- Keep hero section concise and compelling
- Use specific numbers in stats (builds credibility)
- Include client testimonials if available
- Showcase your best work in case studies

### Performance

- Optimize images (use WebP format when possible)
- Keep content concise for better loading
- Test on mobile devices

### SEO Best Practices

- Use descriptive page titles and meta descriptions
- Include relevant keywords naturally
- Set up Google Analytics/Search Console
- Create quality blog content regularly

## Support

If you need help customizing this template:

1. Check the main README.md for technical details
2. Review the code comments for guidance
3. Test changes locally before deploying

## Checklist

Before going live:

- [ ] Updated all content in `content/site.ts`
- [ ] Replaced all placeholder images
- [ ] Set brand colors
- [ ] Tested contact form (if using)
- [ ] Added real client logos/testimonials
- [ ] Set up analytics
- [ ] Configured SEO settings
- [ ] Tested on mobile devices
- [ ] Set up admin panel (if desired)
- [ ] Created initial blog posts (if using blog)

Your professional agency website is ready to launch! 🚀
