"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

const INPUT = ["wheel", "touchstart", "keydown", "pointerdown"];

// Home page. Work and Journey size themselves with JavaScript after
// the browser has already jumped to a #section in the URL, so that jump can
// land in the wrong place. Once ScrollTrigger has measured everything, line
// the target up again — unless the visitor has started scrolling.
export default function HashAlign() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (!target) return;

    const align = () => target.scrollIntoView({ block: "start" });
    const stop = () => {
      ScrollTrigger.removeEventListener("refresh", align);
      for (const type of INPUT) window.removeEventListener(type, stop);
    };

    ScrollTrigger.addEventListener("refresh", align);
    for (const type of INPUT) window.addEventListener(type, stop, { passive: true });
    const frame = requestAnimationFrame(align);
    const timer = setTimeout(stop, 4000);

    return () => {
      stop();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
