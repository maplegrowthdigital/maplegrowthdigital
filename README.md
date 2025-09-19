# Agency Website Template — Next.js + Tailwind

A clean, modern agency website template built with Next.js (App Router) and Tailwind CSS. Perfect for web agencies, freelancers, and digital studios. Features a complete content management system, blog, dark mode, and professional design components.

## Quick Start

- Requirements: Node 18+ (or 20+), npm
- Install: `npm install`
- Dev server: `npm run dev` → http://localhost:3000
- Production build: `npm run build` then `npm start`

## Scripts

- `npm run dev` — start Next.js in dev mode
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — Next lint

## Project Structure

- `app/` — App Router pages and global styles
  - `app/layout.tsx` — global layout (header, footer, dark mode classes)
  - `app/page.tsx` — homepage composition
  - `app/admin/` — admin panel for content management
  - `app/blog/` — blog system with dynamic routing
  - `app/api/` — API routes for admin functionality
  - `app/globals.css` — Tailwind layers, global utilities, animations
- `components/` — UI components
  - `Header.tsx`, `HeaderNav.tsx`, `MobileNav.tsx` — navigation components
  - `Hero.tsx`, `Services.tsx`, `Process.tsx`, `CaseStudies.tsx`, `About.tsx`, `Belief.tsx`, `BookCall.tsx`, `Contact.tsx`
  - `Container.tsx` — page container
  - `ShapesBackdrop.tsx` — reusable animated brand shapes
  - `Reveal.tsx` — reveal-on-scroll animations
  - `Markdown.tsx` — markdown rendering for blog posts
- `content/site.ts` — default site content (customize for your agency)
- `public/` — static assets (logos, images, uploads)
- `utils/supabase/` — database integration for dynamic content

## Features

### Core Technology

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS 3** with custom design system
- **Supabase** integration for dynamic content (optional)
- **Framer Motion** for smooth animations
- **Vercel Analytics** for performance tracking

### Content Management

- **Admin Panel** (`/admin`) with Basic Auth protection
- **Dynamic Content Editing** for all site sections
- **Blog System** with markdown support and media uploads
- **Image Upload System** (Supabase Storage or local fallback)
- **SEO Management** with JSON-LD schema generation

### Design & UX

- **Dark Mode** toggle with system preference detection
- **Responsive Design** with mobile-first approach
- **Custom Brand Colors** easily configurable
- **Dual Font System** with Montserrat headings and Open Sans body by default
- **Animated Components** with reveal-on-scroll effects
- **Professional Sections**:
  - Hero with customizable stats
  - Services showcase
  - Process/methodology display
  - Case studies with results
  - Team/about section
  - Contact form and details
  - Client logo marquee

### Performance & SEO

- **Static Site Generation** for optimal performance
- **Dynamic Metadata** generation
- **Sitemap & Robots.txt** auto-generation
- **Image Optimization** with Next.js Image component
- **Accessibility** features and semantic HTML

## Customization

### Quick Setup

1. **Update Content**: Edit `content/site.ts` with your agency information
2. **Brand Styles**: Visit `/admin → Brand` to update your logo, primary/button colors, and font stack (or edit `tailwind.config.js` if you prefer code). Headings default to Montserrat while body copy uses Open Sans.
3. **Images**: Replace files in `public/` directory
4. **Contact Info**: Update email, phone, and social links
5. **Services**: Customize your service offerings and descriptions

### Content Structure

- `hero` — Main headline, stats, and hero image
- `services` — Your service offerings with descriptions
- `process` — Your methodology/workflow
- `caseStudies` — Portfolio projects with results
- `about` — Team information and company story
- `contact` — Contact details and social links
- `clientLogos` — Client logo carousel

### Advanced Customization

- **Admin Panel**: Access `/admin` to edit content dynamically
- **Blog Setup**: Add posts through the admin interface
- **SEO Settings**: Configure metadata and schema markup
- **Upload System**: Set up Supabase for media uploads (optional)

## Content Management

### Static Content (Default)

Edit `content/site.ts` to customize your agency's information. This serves as the fallback content and initial setup.

### Dynamic Content (Optional)

Set up Supabase for live content editing:

1. Create a Supabase project
2. Add environment variables (see below)
3. Access `/admin` to edit content in real-time
4. Upload images and manage blog posts

### Blog System

- Create posts through the admin panel
- Supports markdown content with syntax highlighting
- Audio/video embedding for podcasts
- Tag system and SEO optimization
- Automatic table of contents generation

## Assets

- Place images in `public/` and reference them with root‑relative paths (e.g. `/images/hero.png`).
- Example assets used here are placeholders or downloaded from the public site for demo.

## Deployment

- Vercel (recommended): push to a repo and import into Vercel
- Any Node host: `npm run build` then `npm start`

### Environment Variables

For full functionality, create a `.env.local` file:

```env
# Supabase Configuration (Optional - for dynamic content)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Panel Authentication
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
```

**Supabase Setup** (Optional):

1. Create a Supabase project
2. Create a public storage bucket named `uploads`
3. Set up the required database tables (see documentation)
4. Add your credentials to `.env.local`

**Without Supabase**: The site works perfectly with static content from `content/site.ts`

## Getting Started

1. **Clone and Install**:

   ```bash
   git clone <your-repo>
   cd agency-website
   npm install
   ```

2. **Customize Content**:

   - Edit `content/site.ts` with your agency information
   - Replace logo and images in `public/` directory
   - Update brand colors in `tailwind.config.js`

3. **Run Development Server**:

   ```bash
   npm run dev
   ```

4. **Optional - Set up Admin Panel**:
   - Create Supabase project
   - Add environment variables
   - Access `/admin` for content management

## Deployment

**Vercel (Recommended)**:

1. Push to GitHub/GitLab
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

**Other Platforms**:

- Build: `npm run build`
- Start: `npm start`
- Supports any Node.js hosting platform

## Support & Customization

This template is designed to be easily customizable for any agency or freelancer. Key areas to personalize:

- **Content**: Update all text, images, and contact information
- **Branding**: Modify colors, fonts, and visual elements
- **Services**: Customize service offerings and descriptions
- **Portfolio**: Add your own case studies and projects
- **Team**: Update about section with your team information

The admin panel makes ongoing content updates simple without touching code.

## License

This project is provided as an open-source template. Feel free to use it for your agency or client projects. Please replace all content, images, and branding with your own.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to improve this template.
