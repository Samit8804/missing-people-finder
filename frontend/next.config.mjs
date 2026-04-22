/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. This is highly recommended for Vercel
    // deployments of MVPs to prevent builds from failing over minor UI warnings.
    ignoreDuringBuilds: true,
  },
  images: {
    // Allow Next.js to render images hosted on Cloudinary and Unsplash
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;
