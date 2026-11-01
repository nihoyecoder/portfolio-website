/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 75 is the default; 90 is for detailed product shots (see image() in lib/case-study.js).
    qualities: [75, 90],
    // Keep resized images cached for 31 days (the default is 4 hours, which a
    // portfolio's traffic never keeps warm, so most visits waited ~1–2s per
    // image while it was resized again). The browser caches them as long.
    // To replace an image, give the new file a new name: a cached version of
    // the old file would otherwise be served until it expires.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
