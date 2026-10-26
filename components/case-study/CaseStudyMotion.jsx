"use client";

import { useRef } from "react";
import { gsap, media, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CLIP_OPEN = "inset(0% 0% 0% 0% round 18px)";

// Calm motion for case studies: a short intro, then content fades in once
// as it scrolls into view (0.4s, a 16px rise, no masks — text is never
// clipped or left half-faded), and [data-parallax] images drift slightly.
// No pinning; nothing moves with reduced motion.
export default function CaseStudyMotion({ children, ...props }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        // Intro: title rises, details follow, the hero visual opens.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            q("[data-intro-title]"),
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4 },
            0,
          )
          .fromTo(
            q("[data-intro]:not([data-intro-title]):not([data-intro-media])"),
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.03 },
            0.08,
          )
          .fromTo(
            q("[data-intro-media]"),
            { clipPath: "inset(6% 4% 0% 4% round 18px)", autoAlpha: 0 },
            { clipPath: CLIP_OPEN, autoAlpha: 1, duration: 0.4, clearProps: "clipPath" },
            0.15,
          );

        // Parallax: an image in a [data-parallax] frame drifts a little
        // inside it as it passes; the slight overscale keeps edges covered.
        q("[data-parallax] img").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -3, scale: 1.08 },
            {
              yPercent: 3,
              scale: 1.08,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Reveals: only for what's still below the fold, so nothing on
        // screen blinks out and back in.
        const below = (el) => el.getBoundingClientRect().top > window.innerHeight;
        const texts = q("[data-reveal]:not([data-reveal='media'])").filter(below);
        const visuals = q("[data-reveal='media']").filter(below);
        const markers = q("[data-marker]").filter(below);

        // Annotation boxes settle in just after their screenshot opens.
        if (markers.length) {
          gsap.set(markers, { autoAlpha: 0, scale: 0.97 });
          ScrollTrigger.batch(markers, {
            start: "top 85%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, scale: 1, duration: 0.3, delay: 0.25, ease: "power3.out", stagger: 0.08 }),
          });
        }

        // (Short pages may have nothing below the fold.)
        if (texts.length) gsap.set(texts, { autoAlpha: 0, y: 16 });
        if (visuals.length) gsap.set(visuals, { autoAlpha: 0, clipPath: "inset(5% 3% 5% 3% round 18px)" });

        ScrollTrigger.batch(texts, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.04 }),
        });
        ScrollTrigger.batch(visuals, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              clipPath: CLIP_OPEN,
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.05,
              clearProps: "clipPath",
            }),
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <article ref={ref} {...props}>
      {children}
    </article>
  );
}
