-- MapleGrowth Digital Database Setup
-- Run these queries in your Supabase SQL editor

-- 1. Create the sections table for content management
CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the posts table for blog functionality
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 4. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_sections_updated_at 
    BEFORE UPDATE ON sections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Insert default sections data (optional - provides initial content structure)
INSERT INTO sections (id, data) VALUES 
('settings', '{
    "seoTitle": "MapleGrowth Digital - Canadian Digital Marketing Agency",
    "seoDescription": "Professional web solutions for growing Canadian businesses. We create custom websites and digital experiences that drive results.",
    "siteName": "MapleGrowth Digital",
    "logoUrl": "/logo.png",
    "brandColor": "#C62828",
    "headingFontFamily": "Montserrat, sans-serif",
    "bodyFontFamily": "Open Sans, sans-serif"
}'),
('hero', '{
    "title": "Professional Web Solutions",
    "subhead": "For Growing Canadian Businesses.",
    "body": "We create custom websites and digital experiences that help your business stand out. Our team focuses on quality, performance, and results that matter to your bottom line.",
    "image": "/images/hero-graphic.svg",
    "stats": [
        {"value": "5+ yrs", "label": "Experience"},
        {"value": "50+", "label": "Projects delivered"},
        {"value": "10", "label": "Active clients"},
        {"value": "Canada", "label": "Based"}
    ],
    "primaryCta": {
        "label": "Book a call",
        "href": "https://tidycal.com/your-booking-link",
        "target": "_blank"
    },
    "secondaryCta": {
        "label": "See case studies",
        "href": "#case-studies"
    }
}'),
('contact', '{
    "email": "connect@maplegrowthdigital.ca",
    "phone": "+1 (555) 123-4567",
    "location": "Canada (Remote)",
    "socials": [
        {"label": "LinkedIn", "href": "#"},
        {"label": "Twitter", "href": "#"},
        {"label": "Instagram", "href": "#"}
    ]
}')
ON CONFLICT (id) DO NOTHING;

-- 7. Set up Row Level Security (RLS) policies for public read access
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sections
CREATE POLICY "Allow public read access to sections" ON sections
    FOR SELECT USING (true);

-- Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts" ON posts
    FOR SELECT USING (published = true);

-- Note: For admin access, you'll need to create additional policies
-- or use the service role key for full access in your admin interface

COMMENT ON TABLE sections IS 'Stores website content sections as JSON data';
COMMENT ON TABLE posts IS 'Stores blog posts with markdown content';
COMMENT ON COLUMN sections.id IS 'Section identifier (e.g., hero, services, about)';
COMMENT ON COLUMN sections.data IS 'Section content stored as JSON';
COMMENT ON COLUMN posts.slug IS 'URL-friendly post identifier';
COMMENT ON COLUMN posts.published IS 'Whether the post is publicly visible';
