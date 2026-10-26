import { seo } from "@/data/profile";
import { fontVariables } from "@/lib/fonts";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata = {
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
    card: "summary",
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
      </body>
    </html>
  );
}
