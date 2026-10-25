/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 75 is the default; 90 is for detailed product shots (see image() in lib/case-study.js).
    qualities: [75, 90],
  },
};

export default nextConfig;
