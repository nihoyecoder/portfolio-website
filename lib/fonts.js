// Font setup. Each font exposes a CSS variable that globals.css maps to
// Tailwind's font-sans / font-serif / font-mono utilities.
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

import { Geist_Mono, Instrument_Serif, Manrope } from "next/font/google";

export const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-accent",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
