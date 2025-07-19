/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Flam-AI_FrontendTask_hr-dashboard' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Flam-AI_FrontendTask_hr-dashboard' : ''
}

module.exports = nextConfig