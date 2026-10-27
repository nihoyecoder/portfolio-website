// Font setup. Each font exposes a CSS variable that globals.css maps to
// Tailwind's font-sans / font-mono / font-display utilities.
//
// These are self-hosted at build time by next/font. To switch to licensed
// local files later, replace a loader with next/font/local and keep the same
// `variable` name — nothing else needs to change:
//
// import localFont from "next/font/local";
// export const sans = localFont({
//   src: [{ path: "../public/fonts/YourFont-Variable.woff2", weight: "100 900" }],
//   variable: "--font-primary",
//   display: "swap",
// });

import localFont from "next/font/local";
import { Geist_Mono, Manrope } from "next/font/google";

export const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

// Clash Display Medium (Indian Type Foundry, free from Fontshare under the
// ITF Free Font License), self-hosted from public/fonts: the hero name and
// role, the accent word in section headings and the case-study display lines.
export const display = localFont({
  src: [{ path: "../public/fonts/ClashDisplay-500.woff2", weight: "500" }],
  variable: "--font-clash",
  display: "swap",
});

export const fontVariables = `${sans.variable} ${mono.variable} ${display.variable}`;
