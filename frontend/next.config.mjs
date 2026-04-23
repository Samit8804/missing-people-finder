/** @type {import('next').NextConfig} */
const nextConfig = {\n  output: 'export',\n  trailingSlash: true,
  // eslint: {
    // ignoreDuringBuilds: true,  // Removed: Next.js 14+ doesn't support eslint in next.config
  images: {
    // Allow Next.js to render images hosted on Cloudinary and Unsplash
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;
