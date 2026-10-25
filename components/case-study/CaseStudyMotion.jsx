"use client";

import { useRef } from "react";
import { gsap, media, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CLIP_OPEN = "inset(0% 0% 0% 0% round 18px)";

// Calm motion for case studies: a short intro (~1s), then content fades in
// once as it scrolls into view, and [data-parallax] images drift slightly.
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
            { yPercent: 105, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out" },
            0,
          )
          .fromTo(
            q("[data-intro]:not([data-intro-title]):not([data-intro-media])"),
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.04 },
            0.1,
          )
          .fromTo(
            q("[data-intro-media]"),
            { clipPath: "inset(6% 4% 0% 4% round 18px)", autoAlpha: 0 },
            { clipPath: CLIP_OPEN, autoAlpha: 1, duration: 1, clearProps: "clipPath" },
            0.2,
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
              gsap.to(batch, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.5, ease: "power3.out", stagger: 0.12 }),
          });
        }

        // (Short pages may have nothing below the fold.)
        if (texts.length) gsap.set(texts, { autoAlpha: 0, y: 24 });
        if (visuals.length) gsap.set(visuals, { autoAlpha: 0, clipPath: "inset(5% 3% 5% 3% round 18px)" });

        ScrollTrigger.batch(texts, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }),
        });
        ScrollTrigger.batch(visuals, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              clipPath: CLIP_OPEN,
              duration: 1.1,
              ease: "power3.out",
              stagger: 0.08,
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
