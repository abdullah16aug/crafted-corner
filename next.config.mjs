import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    // Specify which routes should not be statically generated
    serverActions: true,
  },

  // Disable static generation for specific pages
  unstable_excludeFiles: ['**/node_modules/**'],

  // Skip prerendering for dynamic client-side pages
  unstable_skipMiddlewareUrlNormalize: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
