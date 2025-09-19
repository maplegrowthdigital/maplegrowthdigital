# Database Setup Guide - Supabase Integration

This guide explains how to set up the database for the agency website template's admin panel and dynamic content features.

## Overview

The template uses Supabase as the backend database for:

- Dynamic content management (sections table)
- Blog posts and media (posts table)
- File uploads (storage bucket)

## Prerequisites

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

## Database Schema

### Tables Required

1. **sections** - Stores dynamic content for each website section
2. **posts** - Stores blog posts with metadata
3. **uploads** storage bucket - Stores uploaded images and media files

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in project details:
   - Name: `agency-website` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Wait for project to be created (2-3 minutes)

### 2. Get API Keys

1. In your Supabase dashboard, go to Settings → API
2. Copy these values for your `.env.local` file:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

### 3. Create Database Tables

Go to SQL Editor in your Supabase dashboard and run these queries:

#### Create Sections Table

```sql
-- Create sections table for dynamic content management
CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sections
CREATE POLICY "Allow public read access on sections" ON sections
  FOR SELECT USING (true);

-- Allow authenticated users to modify sections (for admin panel)
CREATE POLICY "Allow authenticated users to modify sections" ON sections
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_sections_id ON sections(id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Create Posts Table

```sql
-- Create posts table for blog functionality
CREATE TABLE posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_md TEXT,
  cover_image TEXT,
  author TEXT,
  tags TEXT[],
  date DATE DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT false,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts only
CREATE POLICY "Allow public read access to published posts" ON posts
  FOR SELECT USING (published = true);

-- Allow authenticated users full access (for admin panel)
CREATE POLICY "Allow authenticated users full access to posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_date ON posts(date DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Create Storage Bucket

```sql
-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

-- Create storage policies
CREATE POLICY "Allow public read access on uploads bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
```

### 5. Seed Initial Data (Optional)

You can populate the sections table with default content:

```sql
-- Insert default settings
INSERT INTO sections (id, data) VALUES (
  'settings',
  '{
    "logoUrl": "/logo.png",
    "seoTitle": "Your Agency - Professional Web Solutions",
    "seoDescription": "We create custom websites and digital experiences that help your business grow.",
    "siteName": "Your Agency",
    "canonicalUrl": "https://yourdomain.com",
    "faviconUrl": "/favicon.png"
  }'::jsonb
);

-- Insert default hero section
INSERT INTO sections (id, data) VALUES (
  'hero',
  '{
    "title": "Professional Web Solutions",
    "subhead": "For Growing Businesses.",
    "body": "We create custom websites and digital experiences that help your business stand out.",
    "image": "/images/hero-graphic.svg",
    "stats": [
      {"value": "5+ yrs", "label": "Experience"},
      {"value": "50+", "label": "Projects delivered"},
      {"value": "10", "label": "Active clients"},
      {"value": "Global", "label": "Remote team"}
    ]
  }'::jsonb
);

-- Insert default section visibility (all sections visible by default)
INSERT INTO sections (id, data) VALUES (
  'sectionVisibility',
  '{
    "hero": true,
    "marquee": true,
    "services": true,
    "process": true,
    "caseStudies": true,
    "beliefs": true,
    "about": true,
    "clients": true,
    "book": true,
    "contact": true
  }'::jsonb
);
```

## Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Panel Authentication
ADMIN_USER=admin
ADMIN_PASS=your-secure-password-here
```

**Important**:

- Replace `your-project-id` with your actual Supabase project ID
- Replace the keys with your actual API keys from Supabase dashboard
- Use a strong password for admin access
- Never commit `.env.local` to version control

## Verification

### Test Database Connection

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. The site should load with default content
4. Visit `http://localhost:3000/admin`
5. Login with your admin credentials
6. Try editing content - changes should save to database

### Test File Uploads

1. In admin panel, try uploading an image
2. Check Supabase Storage → uploads bucket
3. Uploaded files should appear there
4. Images should be accessible via public URLs

## Database Management

### Backup Your Data

```sql
-- Export sections data
SELECT * FROM sections;

-- Export posts data
SELECT * FROM posts;
```

### Common Queries

#### Get all published posts

```sql
SELECT slug, title, excerpt, date, published
FROM posts
WHERE published = true
ORDER BY date DESC;
```

#### Get specific section content

```sql
SELECT data FROM sections WHERE id = 'hero';
```

#### Update section content

```sql
UPDATE sections
SET data = '{"title": "New Title", "subtitle": "New Subtitle"}'::jsonb
WHERE id = 'hero';
```

#### Get posts by tag

```sql
SELECT * FROM posts
WHERE 'web-design' = ANY(tags)
AND published = true;
```

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your environment variables are correct
2. **Permission Denied**: Ensure RLS policies are set up correctly
3. **Upload Fails**: Check storage bucket exists and has correct policies
4. **Admin Panel Won't Load**: Verify ADMIN_USER and ADMIN_PASS are set

### Reset Database

If you need to start over:

```sql
-- Drop tables (careful - this deletes all data!)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS sections;

-- Delete storage bucket
DELETE FROM storage.buckets WHERE id = 'uploads';
```

Then re-run the setup queries above.

## Security Considerations

1. **Row Level Security**: All tables have RLS enabled
2. **API Keys**: Keep service role key secret, only use in server-side code
3. **Admin Authentication**: Use strong passwords for admin panel
4. **File Uploads**: Only authenticated users can upload files
5. **Public Access**: Only published content is publicly accessible

## Performance Tips

1. **Indexes**: All necessary indexes are created automatically
2. **Caching**: Consider using Supabase's built-in caching
3. **CDN**: Use Supabase's CDN for file storage
4. **Connection Pooling**: Enabled by default in Supabase

## Migration from Static Content

If you want to migrate your existing static content to the database:

1. Export your `content/site.ts` data
2. Convert each section to JSON format
3. Insert into sections table using the queries above
4. Test admin panel functionality
5. Content will now be editable through admin interface

Your database is now ready for the agency website template! 🎉

## Support

If you encounter issues:

1. Check Supabase dashboard for error logs
2. Verify all environment variables are correct
3. Ensure database queries ran successfully
4. Test with simple queries first before complex operations
