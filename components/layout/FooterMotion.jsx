"use client";

import { useRef } from "react";
import { gsap, media, useGSAP } from "@/lib/gsap";

// A calm entrance: content rises in with a small stagger, then the giant
// name lifts into place. Nothing moves with reduced motion.
export default function FooterMotion({ children, ...props }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.from(q("[data-footer-rise]"), {
          opacity: 0,
          y: 20,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        });
        gsap.from(q("[data-footer-name]"), {
          opacity: 0,
          yPercent: 18,
          duration: 1.4,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: q("[data-footer-name]")[0], start: "top bottom", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} {...props}>
      {children}
    </footer>
  );
}
