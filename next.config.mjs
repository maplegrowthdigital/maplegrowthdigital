/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : undefined;

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow images from Supabase Storage public URLs
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: 'https',
            hostname: supabaseHostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
