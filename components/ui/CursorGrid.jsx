"use client";

import { useRef } from "react";
import { gsap, media, useGSAP } from "@/lib/gsap";
import styles from "./CursorGrid.module.css";

// Grid cell (px). Shared with the CSS through --cell.
const CELL = 52;

// A grid hidden in a section's background, revealed around the cursor inside
// a soft pink glow. Decorative, behind all of the section's content, never
// takes the pointer.
//
// Render it as a direct child of the section it decorates. That element must
// be positioned and form a stacking context (z-index or isolation: isolate),
// so the grid sits above its background and below its content.
//
// Only one small square (the spot) follows the cursor, by transform alone, so
// following it never repaints the host. Inside it, the grid is shifted back by
// the spot's offset (modulo one cell), so the lines stay fixed to the section and
// the spot reveals them as it passes rather than dragging them along.
//
// Mouse and trackpad only, from tablet width up, and not for reduced motion
// (media.pointer, like the hero portrait's drift); elsewhere it stays hidden.
export default function CursorGrid() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(media.pointer, () => {
        const root = ref.current;
        const host = root.parentElement;
        const spot = root.firstElementChild;
        const lines = spot.querySelector("[data-grid-lines]");

        // Measured on resize, not per frame.
        let half = 0;
        let phase = { x: 0, y: 0 }; // puts a line through the section's centre
        const measure = () => {
          half = spot.offsetWidth / 2;
          phase = { x: (host.offsetWidth / 2) % CELL, y: (host.offsetHeight / 2) % CELL };
        };
        measure();

        const mod = (value) => ((value % CELL) + CELL) % CELL;
        const pos = { x: 0, y: 0 };
        const apply = () => {
          const x = pos.x - half;
          const y = pos.y - half;
          spot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          lines.style.transform = `translate3d(${-mod(x - phase.x)}px, ${-mod(y - phase.y)}px, 0)`;
        };

        // Eased follow: the spot trails the cursor slightly.
        const follow = { duration: 0.65, ease: "power3.out", onUpdate: apply };
        const xTo = gsap.quickTo(pos, "x", follow);
        const yTo = gsap.quickTo(pos, "y", follow);

        let shown = false;
        let client = null; // last pointer position, to follow while scrolling

        const moveTo = (clientX, clientY) => {
          const rect = host.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          if (!shown) {
            // Appear where the cursor is, rather than gliding in from where it left.
            xTo(x, x);
            yTo(y, y);
            shown = true;
            gsap.to(spot, { opacity: 1, duration: 0.6, ease: "power2.out", overwrite: true });
          } else {
            xTo(x);
            yTo(y);
          }
        };

        const onPointerMove = (event) => {
          client = { x: event.clientX, y: event.clientY };
          moveTo(client.x, client.y);
        };
        const onPointerLeave = () => {
          client = null;
          shown = false;
          gsap.to(spot, { opacity: 0, duration: 0.9, ease: "power2.out", overwrite: true });
        };
        // The page scrolls under a still cursor: keep the spot under it.
        const onScroll = () => {
          if (client) moveTo(client.x, client.y);
        };

        host.addEventListener("pointermove", onPointerMove);
        host.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
          host.removeEventListener("pointermove", onPointerMove);
          host.removeEventListener("pointerleave", onPointerLeave);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", measure);
          gsap.killTweensOf([spot, pos]);
          gsap.set(spot, { clearProps: "opacity,transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className={styles.root} style={{ "--cell": `${CELL}px` }}>
      <div className={styles.spot}>
        <div className={styles.glow} />
        <div className={styles.mask}>
          <div data-grid-lines className={styles.lines} />
        </div>
      </div>
    </div>
  );
}
