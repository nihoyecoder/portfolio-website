"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, media, useGSAP } from "@/lib/gsap";

// A link that drifts slightly toward the cursor while hovered. The inner
// label moves a little further than the frame for a sense of depth.
// Only active for fine pointers with motion allowed; otherwise a plain link.
export default function MagneticButton({
  href,
  children,
  className = "",
  strength = 0.12,
  ...props
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el.querySelector("[data-magnetic-inner]");
      const mm = gsap.matchMedia();

      mm.add(media.pointer, () => {
        const tween = { duration: 0.7, ease: "power3.out" };
        const xTo = gsap.quickTo(el, "x", tween);
        const yTo = gsap.quickTo(el, "y", tween);
        const innerXTo = inner && gsap.quickTo(inner, "x", tween);
        const innerYTo = inner && gsap.quickTo(inner, "y", tween);

        const move = (x, y) => {
          xTo(x);
          yTo(y);
          innerXTo?.(x * 0.5);
          innerYTo?.(y * 0.5);
        };

        const onMove = (event) => {
          const rect = el.getBoundingClientRect();
          move(
            (event.clientX - (rect.left + rect.width / 2)) * strength,
            (event.clientY - (rect.top + rect.height / 2)) * strength,
          );
        };
        const onLeave = () => move(0, 0);

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <Link ref={ref} href={href} className={className} {...props}>
      <span data-magnetic-inner className="inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </Link>
  );
}
