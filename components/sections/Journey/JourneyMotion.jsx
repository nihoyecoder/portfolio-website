"use client";

import { useRef } from "react";
import { coverExit, gsap, media, ScrollTrigger, useGSAP } from "@/lib/gsap";

// The focus line — where a card becomes the active one — as a fraction of
// the viewport height, measured from the top.
const FOCUS = { desktop: 0.45, mobile: 0.55 };

// Viewport heights the last card stays active before the sticky panel releases.
const HOLD = 0.18;

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

// Owns all Journey motion; markup comes from Journey.jsx (a Server Component).
// Nothing here pins or smooth-scrolls: the panel is CSS sticky and the page
// keeps native scrolling, so this coexists with the Work section's pin.
export default function JourneyMotion({ children, ...props }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Cover into Contact: once Journey's bottom meets the viewport's, it
      // holds still while Contact (above it, opaque) scrolls up over it, 1:1
      // with the scroll — like the hero under Selected Work. pinSpacing: false
      // adds no spacer, so the page length and Contact's position don't change.
      // Native scroll, so the hold stays for reduced motion; the fall below
      // is motion only.
      let onCover = null;
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

      // Over the same range Journey's content sinks, tips back and fades.
      mm.add(media.motion, () => {
        onCover = coverExit(root, [...root.children]);
        onCover(cover.progress);
        return () => {
          onCover = null;
        };
      });

      const [list] = q("[data-journey-list]");
      const items = q("[data-journey-item]");
      const count = items.length;

      const resetItems = () => {
        for (const el of items) {
          el.style.removeProperty("--e");
          el.style.removeProperty("--ahead");
        }
      };

      // ---- Split layout on short screens: keep the whole panel in view ----
      // If the sticky panel is taller than the room below its usual offset,
      // it sticks higher so its end (the workflow tools) stays on screen.
      // Layout only, so it applies with reduced motion too; registered before
      // the choreography so `fit` below reads the adjusted offset.
      mm.add("(min-width: 1024px)", () => {
        const [panel] = q("[data-journey-panel]");
        const keepInView = () => {
          panel.style.removeProperty("top");
          const top = parseFloat(getComputedStyle(panel).top) || 0;
          const room = window.innerHeight - panel.offsetHeight - 16;
          if (room < top) panel.style.top = `${Math.max(0, room)}px`;
        };
        keepInView();
        ScrollTrigger.addEventListener("refreshInit", keepInView);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", keepInView);
          panel.style.removeProperty("top");
        };
      });

      // ---- Split layout: active card and sticky choreography ----
      mm.add(DESKTOP, () => {
        root.dataset.mode = "active";

        const [panel] = q("[data-journey-panel]");

        // Spacing that ties the sticky range to the timeline:
        //   lead — card 1 sits on the focus line the moment the panel sticks
        //   tail — the panel releases shortly after the last card has passed
        const fit = () => {
          const vh = window.innerHeight;
          const top = parseFloat(getComputedStyle(panel).top) || 0;
          const focusY = vh * FOCUS.desktop;
          const lead = focusY - top - items[0].offsetHeight / 2;
          const tail =
            top + panel.offsetHeight - items[count - 1].offsetHeight / 2 - focusY + vh * HOLD;
          list.style.setProperty("--lead", `${Math.max(16, lead)}px`);
          list.style.setProperty("--tail", `${Math.max(16, tail)}px`);
        };
        fit();
        ScrollTrigger.addEventListener("refreshInit", fit);

        trackFocus({
          list,
          items,
          focus: FOCUS.desktop,
          onChange: (at) => {
            for (let i = 0; i < count; i++) {
              const d = i - at;
              items[i].style.setProperty("--e", Math.max(0, 1 - Math.abs(d)).toFixed(3));
              items[i].style.setProperty("--ahead", gsap.utils.clamp(0, 1, d).toFixed(3));
            }
          },
        });

        revealIntro(q);
        revealWorkflow(q);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", fit);
          delete root.dataset.mode;
          list.style.removeProperty("--lead");
          list.style.removeProperty("--tail");
          resetItems();
        };
      });

      // ---- Stacked layout: native scroll, dots follow the reader ----
      mm.add(MOBILE, () => {
        root.dataset.mode = "dots";

        trackFocus({
          list,
          items,
          focus: FOCUS.mobile,
          onChange: (at) => {
            for (let i = 0; i < count; i++) {
              items[i].style.setProperty("--e", Math.max(0, 1 - Math.abs(i - at)).toFixed(3));
            }
          },
        });

        revealIntro(q);

        revealWorkflow(q);

        return () => {
          delete root.dataset.mode;
          resetItems();
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

// Tracks a continuous index of the card on the focus line (2.5 = halfway
// between the third and fourth card) and reports it, smoothed, to onChange.
// Card centres are measured once per refresh, never per frame.
function trackFocus({ list, items, focus, onChange }) {
  const state = { at: 0 };
  let listTop = 0;
  let centers = [];

  const measure = () => {
    listTop = 0;
    for (let el = list; el; el = el.offsetParent) listTop += el.offsetTop;
    centers = items.map((el) => el.offsetTop + el.offsetHeight / 2);
  };

  const target = () => {
    const line = window.scrollY + window.innerHeight * focus - listTop;
    if (line <= centers[0]) return 0;
    for (let i = 0; i < centers.length - 1; i++) {
      if (line < centers[i + 1]) {
        return i + (line - centers[i]) / (centers[i + 1] - centers[i]);
      }
    }
    return centers.length - 1;
  };

  const draw = () => onChange(state.at);
  const to = gsap.quickTo(state, "at", { duration: 0.45, ease: "power3.out", onUpdate: draw });

  const sync = () => {
    measure();
    const at = target();
    to(at, at);
    draw();
  };

  ScrollTrigger.create({
    trigger: list,
    start: "top bottom",
    end: "bottom top",
    onUpdate: () => to(target()),
    onRefresh: sync,
  });

  sync();
}

// One-shot reveals, as the block's top passes 85% of the viewport: a short
// fade and a small rise (no masks, so nothing is ever clipped).
const REVEAL = { opacity: 0, y: 16, duration: 0.4, ease: "power3.out" };

// The heading words, then the intro, ladder and Resume link.
function revealIntro(q) {
  gsap
    .timeline({ scrollTrigger: { trigger: q("[data-journey-intro]")[0], start: "top 85%", once: true } })
    .from(q("[data-journey-word]"), { ...REVEAL, stagger: 0.03 })
    .from(q("[data-journey-fade]"), { ...REVEAL, y: 12, stagger: 0.04 }, 0.1);
}

// The workflow heading, tools and design → code line.
function revealWorkflow(q) {
  gsap
    .timeline({ scrollTrigger: { trigger: q("[data-journey-workflow]")[0], start: "top 85%", once: true } })
    .from(q("[data-journey-workflow-heading]"), REVEAL)
    .from(q("[data-journey-tool]"), { ...REVEAL, y: 12, stagger: 0.04 }, 0.05)
    .from(q("[data-journey-flow]"), { opacity: 0, duration: 0.3 }, 0.2);
}
