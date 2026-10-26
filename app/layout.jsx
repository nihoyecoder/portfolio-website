import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { seo } from "@/data/profile";
import { fontVariables } from "@/lib/fonts";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata = {
  // Absolute URLs for link-preview images (opengraph-image / twitter-image).
  metadataBase: new URL(seo.url),
  title: {
    default: seo.title,
    template: "%s — Manoj Rawat",
  },
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: "website",
    siteName: "Manoj Rawat",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport = {
  themeColor: "#f4f7f5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
        <CustomCursor />
        {/* Vercel Web Analytics and Speed Insights (report on Vercel deploys only). */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
