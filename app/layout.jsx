import { fontVariables } from "@/lib/fonts";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata = {
  title: {
    default: "Manoj Rawat — Product Designer & AI-Augmented Developer",
    template: "%s — Manoj Rawat",
  },
  description:
    "Portfolio of Manoj Rawat, a Product Designer and AI-Augmented Developer designing and building digital products.",
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
