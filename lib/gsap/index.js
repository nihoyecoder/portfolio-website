"use client";

// Single entry point for GSAP. Import from "@/lib/gsap" instead of "gsap"
// directly so plugins are registered exactly once.
//
// Only use these inside Client Components, and run animations through
// useGSAP() so they are created after mount and reverted on unmount
// (no SSR/hydration issues, no leaked ScrollTriggers).

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
export { ease, duration, media } from "./config";
export { coverExit } from "./cover";
