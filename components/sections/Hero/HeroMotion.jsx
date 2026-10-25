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
        const sink = coverExit(root, layers);
        onCover = (progress, resized) => {
          if (resized) sink.invalidate();
          sink.progress(progress);
        };
        onCover(cover.progress);
        return () => {
          onCover = null;
        };
      });

      mm.add(media.motion, () => {
        // EditablePortrait waits for this flag/event before the portrait
        // becomes editable.
        root.removeAttribute("data-intro-done");
        const tl = gsap.timeline({
          defaults: { ease: ease.out },
          onComplete: () => {
            introDone = true;
            root.setAttribute("data-intro-done", "");
            root.dispatchEvent(new Event("hero:introdone"));
          },
        });

        // The header lives outside the hero (it's fixed); its items still enter with it.
        // (Queried on the document: selector text here is scoped to the hero.)
        tl.from(document.querySelectorAll('[data-site-header] [data-anim="nav"]'), { y: -10, autoAlpha: 0, duration: 0.7, stagger: 0.05 }, 0)
          .from(q('[data-anim="meta"]'), { y: -8, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, 0.1)
          .from(q('[data-anim="char"]'), { yPercent: 110, duration: 1.1, stagger: 0.03 }, 0.05)
          .fromTo(
            q('[data-anim="portrait-clip"]'),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: ease.inOut },
            0.2,
          )
          .from(q('[data-anim="portrait-img"]'), { scale: 1.3, yPercent: 8, duration: 1.5 }, 0.2)
          .from(q('[data-anim="line"]'), { yPercent: 105, duration: 0.9, stagger: 0.06 }, 0.6)
          .from(q('[data-anim="copy"]'), { y: 12, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.85)
          .from(q('[data-anim="scroll"]'), { autoAlpha: 0, duration: 0.6 }, 1.2)
          // Tool strings (HeroToolStrings): the lines draw out from behind the
          // portrait, then each card drops in once its line has reached it.
          .add(drawStrings(q('[data-anim="string"]')), 1.05)
          .from(
            q('[data-anim="tool"]'),
            {
              autoAlpha: 0,
              y: -8,
              scale: 0.95,
              rotation: (i) => (i % 2 ? "-=4" : "+=4"),
              duration: 0.6,
              ease: "power3.out",
              stagger: (i, target) => Number(target.dataset.order) * 0.08,
            },
            1.4,
          );

        // Start states are applied above; now it's safe to show the hero, and
        // to lift the header's wait (Header.module.css) so its items fade in.
        gsap.set(root, { visibility: "visible" });
        document.querySelector("[data-site-header]")?.removeAttribute("data-intro");

        return () => root.removeAttribute("data-intro-done");
      });

      mm.add(media.pointer, () => {
        const [mover] = q("[data-portrait-move]");
        const [image] = q('[data-anim="portrait-img"]');
        const [red] = q('[data-rgb="red"]');
        const [blue] = q('[data-rgb="blue"]');

        // Cursor drift: ±6px x, ±4px y relative to the viewport centre.
        const drift = { duration: 1.2, ease: "power3.out" };
        const xTo = gsap.quickTo(mover, "x", drift);
        const yTo = gsap.quickTo(mover, "y", drift);

        // While a portrait anchor is being dragged the drift holds still, so
        // the anchor stays under the cursor (EditablePortrait sends these).
        let editing = false;
        const onEditStart = () => {
          editing = true;
          xTo(gsap.getProperty(mover, "x"));
          yTo(gsap.getProperty(mover, "y"));
        };
        const onEditEnd = () => {
          editing = false;
        };

        const onPointerMove = (event) => {
          if (!introDone || editing) return;
          xTo((event.clientX / window.innerWidth - 0.5) * 12);
          yTo((event.clientY / window.innerHeight - 0.5) * 8);
        };
        const onPointerLeave = () => {
          if (editing) return;
          xTo(0);
          yTo(0);
        };

        // Chromatic split: red/blue channels part by 2px and settle back.
        // On an SVG <image> the filter works in the SVG's units, so the
        // offset is converted from px.
        const split = { amount: 0 };
        let unit = 1;
        const applySplit = () => {
          red.setAttribute("dx", -2 * unit * split.amount);
          blue.setAttribute("dx", 2 * unit * split.amount);
        };
        let splitTl;

        const onPortraitEnter = () => {
          if (!introDone || editing) return;
          unit = 1 / (image.getScreenCTM?.()?.a || 1);
          splitTl?.kill();
          image.style.filter = "url(#hero-rgb-split)";
          splitTl = gsap
            .timeline({
              onComplete: () => {
                image.style.filter = "";
              },
            })
            .to(split, { amount: 1, duration: 0.25, ease: "power2.out", onUpdate: applySplit })
            .to(split, { amount: 0, duration: 0.8, ease: "power3.out", onUpdate: applySplit });
        };

        root.addEventListener("pointermove", onPointerMove);
        root.addEventListener("pointerleave", onPointerLeave);
        mover.addEventListener("pointerenter", onPortraitEnter);
        root.addEventListener("portrait:editstart", onEditStart);
        root.addEventListener("portrait:editend", onEditEnd);

        return () => {
          root.removeEventListener("pointermove", onPointerMove);
          root.removeEventListener("pointerleave", onPointerLeave);
          mover.removeEventListener("pointerenter", onPortraitEnter);
          root.removeEventListener("portrait:editstart", onEditStart);
          root.removeEventListener("portrait:editend", onEditEnd);
          splitTl?.kill();
          image.style.filter = "";
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

// Draws each string from its start (behind the portrait) with a dash that
// starts as long as the line itself. Lines that aren't rendered (below the
// desktop breakpoint) are skipped. The dash is cleared afterwards so later
// resizes can't leave gaps.
function drawStrings(paths) {
  const tl = gsap.timeline();
  paths.forEach((path, i) => {
    const length = screenLength(path);
    if (!length) return;
    tl.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        duration: 0.95,
        ease: "power2.out",
        clearProps: "strokeDasharray,strokeDashoffset",
      },
      i * 0.12,
    );
  });
  return tl;
}

// On-screen length in px. The strings use a non-scaling stroke (dashes are
// measured on screen) inside a stretched viewBox, so getTotalLength() alone
// isn't enough.
function screenLength(path) {
  const ctm = path.getScreenCTM();
  if (!ctm) return 0;
  const total = path.getTotalLength();
  let length = 0;
  let previous = null;
  for (let i = 0; i <= 64; i++) {
    const { x, y } = path.getPointAtLength((total * i) / 64);
    const point = [ctm.a * x + ctm.c * y + ctm.e, ctm.b * x + ctm.d * y + ctm.f];
    if (previous) length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }
  return Math.ceil(length) + 2;
}
