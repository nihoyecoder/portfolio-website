"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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

      const [list] = q("[data-journey-list]");
      const items = q("[data-journey-item]");
      const [workflow] = q("[data-journey-workflow]");
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

      // ---- Split layout: active card, sticky choreography, workflow reveal ----
      mm.add(DESKTOP, () => {
        root.dataset.mode = "active";

        const [panel] = q("[data-journey-panel]");
        const [container] = q("[data-journey-container]");

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

        // Workflow block: revealed as the last card arrives, driven by the same
        // focus index as the cards so it scrubs and reverses with them.
        const reveal = gsap
          .timeline({ paused: true })
          .fromTo(workflow, { y: 35 }, { y: 0, duration: 1, ease: "power2.out" }, 0)
          .fromTo(
            q("[data-journey-workflow-heading]"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
            0,
          )
          .fromTo(
            q("[data-journey-tool]"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.07 },
            0.18,
          )
          .fromTo(q("[data-journey-flow]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);

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
            const progress = gsap.utils.clamp(0, 1, (at - (count - 1.8)) / 0.8);
            reveal.progress(progress);
            workflow.style.pointerEvents = progress > 0.6 ? "" : "none";
          },
        });

        // Entry: the content settles into place as the section rises in.
        gsap.fromTo(
          container,
          { opacity: 0, y: -60, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "top 30%", scrub: 0.6 },
          },
        );

        revealIntro(q);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", fit);
          delete root.dataset.mode;
          list.style.removeProperty("--lead");
          list.style.removeProperty("--tail");
          workflow.style.removeProperty("pointer-events");
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

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: workflow, start: "top 85%", once: true },
          })
          .from(q("[data-journey-workflow-heading]"), { opacity: 0, y: 20, duration: 0.6 })
          .from(q("[data-journey-tool]"), { opacity: 0, y: 18, duration: 0.5, stagger: 0.06 }, 0.1)
          .from(q("[data-journey-flow]"), { opacity: 0, duration: 0.4 }, 0.4);

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

// Heading words rise out of their masks, then the intro and Resume link.
function revealIntro(q) {
  gsap
    .timeline({ scrollTrigger: { trigger: q("[data-journey-intro]")[0], start: "top 80%", once: true } })
    .from(q("[data-journey-word]"), { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.06 })
    .from(
      q("[data-journey-fade]"),
      { opacity: 0, y: 16, duration: 0.8, ease: "power3.out", stagger: 0.08 },
      0.3,
    );
}
