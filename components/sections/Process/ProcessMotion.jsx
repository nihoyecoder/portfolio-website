"use client";

import { useRef } from "react";
import { coverExit, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Timeline units are viewport heights of scroll while the stage is held.
const LEAD = 0.25; // Research rests before the first move
const MOVE = 0.85; // one card rising over the previous
const REST = 0.3; // each stage rests between moves
const TAIL = 0.35; // Handoff rests before the stage releases

// Where a card sits once it has been covered: 0 = in focus, 1 = just behind…
const DEPTH = [
  { y: 0, scale: 1, opacity: 1 },
  { y: -26, scale: 0.94, opacity: 1 },
  { y: -46, scale: 0.88, opacity: 1 },
  { y: -60, scale: 0.82, opacity: 0 },
];
const CONTENT = [1, 0.4, 0, 0]; // content opacity by depth
const WAITING_SCALE = 0.97; // cards still below the active one
const GAP = 56; // px between the active card and the next one waiting below
const IDLE = 0.32; // inactive stage label opacity

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

// Owns all Process motion; markup comes from Process.jsx (a Server Component).
export default function ProcessMotion({ children, ...props }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // ---- Desktop: held stage, one scrubbed master timeline ----
      mm.add(DESKTOP, () => {
        root.dataset.mode = "stage";

        const [track] = q("[data-process-track]");
        const cards = q("[data-process-card]");
        const contents = q("[data-process-content]");
        const navItems = q("[data-process-nav]");
        const count = cards.length;
        const step = () => cards[0].offsetHeight + GAP;

        // Only the first tween of each element renders its start state up
        // front; later ones start from where the previous left off.
        const started = new Set();
        const first = (el) => !started.has(el) && Boolean(started.add(el));

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        tl.addLabel(cardId(cards[0]), 0);

        for (let k = 0; k < count - 1; k++) {
          const at = LEAD + k * (MOVE + REST);

          cards.forEach((card, j) => {
            if (j <= k) {
              // Covered cards step back one depth: up, smaller, content fading.
              const from = Math.min(k - j, DEPTH.length - 1);
              const to = Math.min(k - j + 1, DEPTH.length - 1);
              if (from === to) return;
              tl.fromTo(
                card,
                { ...DEPTH[from] },
                { ...DEPTH[to], duration: MOVE, ease: "power1.inOut", immediateRender: first(card) },
                at,
              ).fromTo(
                contents[j],
                { opacity: CONTENT[from] },
                { opacity: CONTENT[to], duration: MOVE, immediateRender: first(contents[j]) },
                at,
              );
            } else {
              // Waiting cards move up one slot; the next card rises over the stack.
              const slots = j - k;
              tl.fromTo(
                card,
                { y: () => slots * step(), scale: WAITING_SCALE },
                {
                  y: () => (slots - 1) * step(),
                  scale: slots === 1 ? 1 : WAITING_SCALE,
                  duration: MOVE,
                  ease: "power1.inOut",
                  immediateRender: first(card),
                },
                at,
              );
            }
          });

          // Labels hand over once the next card is meaningfully in front.
          const swap = at + MOVE * 0.44;
          tl.fromTo(
            navItems[k],
            { opacity: 1 },
            { opacity: IDLE, duration: MOVE * 0.22, immediateRender: first(navItems[k]) },
            swap,
          ).fromTo(
            navItems[k + 1],
            { opacity: IDLE },
            { opacity: 1, duration: MOVE * 0.22, immediateRender: first(navItems[k + 1]) },
            swap,
          );

          tl.addLabel(cardId(cards[k + 1]), at + MOVE);
        }

        // Trailing rest: the timeline's end is where the stage releases.
        tl.set({}, {}, LEAD + (count - 1) * MOVE + (count - 2) * REST + TAIL);

        // Keep aria-current on the stage whose label has taken over.
        const swaps = Array.from({ length: count - 1 }, (_, k) => LEAD + k * (MOVE + REST) + MOVE * 0.55);
        let current = -1;
        tl.eventCallback("onUpdate", () => {
          const next = swaps.filter((time) => tl.time() >= time).length;
          if (next === current) return;
          current = next;
          navItems.forEach((el, i) => el.setAttribute("aria-current", i === next ? "step" : "false"));
        });

        // Scroll length for the sticky stage = timeline length in viewport
        // heights, plus the cover (--cover, one stage height): the stage stays
        // stuck that much longer while Contact — pulled up by the matching
        // negative margin on .root — slides over it.
        const [stage] = q("[data-process-stage]");
        let cover = 0;
        const fitScrollLength = () => {
          track.style.setProperty("--stage-scroll", `${window.innerHeight * tl.duration()}px`);
          cover = stage.offsetHeight;
          root.style.setProperty("--cover", `${cover}px`);
        };
        fitScrollLength();
        ScrollTrigger.addEventListener("refreshInit", fitScrollLength);

        const drive = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: () => `+=${window.innerHeight * tl.duration()}`,
          animation: tl,
          scrub: 0.7,
          invalidateOnRefresh: true,
        });

        // While Contact covers the stage, its content sinks, tips back and
        // fades 1:1 with the scroll, like the hero's — from Contact's top
        // entering to it reaching the top.
        const fall = coverExit(stage, [...stage.children]);

        ScrollTrigger.create({
          trigger: track,
          start: () => `bottom-=${cover} bottom`,
          end: () => `bottom-=${cover} top`,
          onUpdate: (self) => fall(self.progress),
          onRefresh: (self) => fall(self.progress, true),
        });

        // Clicking a stage scrolls to the point where its card has settled.
        const onClick = (event) => {
          const button = event.target.closest("[data-process-goto]");
          if (!button) return;
          const label = tl.labels[cardId(cards[Number(button.dataset.processGoto)])];
          const y = drive.start + (label / tl.duration()) * (drive.end - drive.start);
          window.scrollTo({ top: y, behavior: "smooth" });
        };
        root.addEventListener("click", onClick);

        revealHeader(q);

        return () => {
          root.removeEventListener("click", onClick);
          ScrollTrigger.removeEventListener("refreshInit", fitScrollLength);
          delete root.dataset.mode;
          track.style.removeProperty("--stage-scroll");
          root.style.removeProperty("--cover");
          navItems.forEach((el) => el.removeAttribute("aria-current"));
        };
      });

      // ---- Phones & tablets: stacked cards with a quiet reveal ----
      mm.add(MOBILE, () => {
        revealHeader(q);
        for (const card of q("[data-process-card]")) {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        }
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

const cardId = (card) => card.getAttribute("aria-labelledby").replace("process-", "");

// Heading words rise out of their masks, then the intro.
function revealHeader(q) {
  gsap
    .timeline({ scrollTrigger: { trigger: q("[data-process-header]")[0], start: "top 80%", once: true } })
    .from(q("[data-process-word]"), { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.06 })
    .from(q("[data-process-fade]"), { opacity: 0, y: 16, duration: 0.8, ease: "power3.out" }, 0.3);
}
