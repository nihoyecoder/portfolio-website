"use client";

import { useRef } from "react";
import { coverExit, ease, gsap, media, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Owns all hero motion; the markup it animates is rendered by Hero.jsx
// (a Server Component) and marked with data-anim / data-portrait-* hooks.
export default function HeroMotion({ children, ...props }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      let introDone = false;

      // Cover transition: once the hero's bottom meets the viewport's, it holds
      // still while Selected Work (above it, opaque) scrolls up over it, 1:1
      // with the scroll. pinSpacing: false adds no spacer, so Work's own
      // position and triggers are untouched; the pin ends ("bottom top") at
      // the exact scroll where Work's top reaches the viewport top and its
      // sticky stage takes over. Native scroll, so it stays for reduced motion.
      let onCover = null; // set below when motion is allowed
      const cover = ScrollTrigger.create({
        trigger: root,
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => onCover?.(self.progress),
        onRefresh: (self) => onCover?.(self.progress, true),
      });

      // Over the same range (driven by the pin's own progress, so the two
      // can't drift apart) the hero's content sinks, tips back and fades 1:1
      // with the scroll: it falls away while Work rises over it. The pinned
      // section itself never moves; only its children do. Motion only.
      mm.add(media.motion, () => {
        const layers = [...root.children].filter((el) => el.tagName !== "NOSCRIPT");
        onCover = coverExit(root, layers);
        onCover(cover.progress);
        return () => {
          onCover = null;
        };
      });

      mm.add(media.motion, () => {
        // The portrait starts drifting with the cursor once the intro is done.
        const tl = gsap.timeline({
          defaults: { ease: ease.out },
          onComplete: () => {
            introDone = true;
          },
        });

        // The header lives outside the hero (it's fixed); its items still enter with it.
        // (Queried on the document: selector text here is scoped to the hero.)
        tl.from(document.querySelectorAll('[data-site-header] [data-anim="nav"]'), { y: -10, autoAlpha: 0, duration: 0.7, stagger: 0.05 }, 0)
          .from(q('[data-anim="meta"]'), { y: -8, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, 0.1)
          .from(q('[data-anim="char"]'), { yPercent: 140, duration: 1.1, stagger: 0.03 }, 0.05)
          .fromTo(
            q('[data-anim="portrait-clip"]'),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: ease.inOut },
            0.2,
          )
          // A gentle settle: the cut-out's shoulders reach its edges, so a
          // bigger zoom would cut them off against the reveal's box.
          .from(q('[data-anim="portrait-img"]'), { scale: 1.03, yPercent: 6, duration: 1.5 }, 0.2)
          .from(q('[data-anim="line"]'), { yPercent: 105, duration: 0.9, stagger: 0.06 }, 0.6)
          .from(q('[data-anim="copy"]'), { y: 12, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.85);

        // Start states are applied above; now it's safe to show the hero, and
        // to lift the header's wait (Header.module.css) so its items fade in.
        gsap.set(root, { visibility: "visible" });
        document.querySelector("[data-site-header]")?.removeAttribute("data-intro");
      });

      mm.add(media.pointer, () => {
        const [mover] = q("[data-portrait-move]");

        // Cursor drift: the portrait follows the pointer across the hero,
        // ±6px x and ±4px y from the viewport's centre, easing back on leave.
        const drift = { duration: 1.2, ease: "power3.out" };
        const xTo = gsap.quickTo(mover, "x", drift);
        const yTo = gsap.quickTo(mover, "y", drift);

        const onPointerMove = (event) => {
          if (!introDone) return;
          xTo((event.clientX / window.innerWidth - 0.5) * 12);
          yTo((event.clientY / window.innerHeight - 0.5) * 8);
        };
        const onPointerLeave = () => {
          xTo(0);
          yTo(0);
        };

        root.addEventListener("pointermove", onPointerMove);
        root.addEventListener("pointerleave", onPointerLeave);

        return () => {
          root.removeEventListener("pointermove", onPointerMove);
          root.removeEventListener("pointerleave", onPointerLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
