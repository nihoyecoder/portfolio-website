"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./CustomCursor.module.css";

// Elements that expand the cursor into the large translucent ring.
const INTERACTIVE = 'a[href], button, [role="button"], select, summary, [data-cursor="interactive"], [data-cursor="hover"]';
// Over text entry only the I-beam shows; the dot fades out so it can't hide the caret.
const NATIVE = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"], iframe, dialog[open]';

const RING = 68; // px, the expanded size the element is drawn at
const DOT = 20; // px, the default solid dot
const GRIP = 12; // px, over a draggable portrait anchor
const MAGNET = 6; // px, the most a small link pulls the ring toward its centre

const ACCENT = "#c4546a";
const TINT = "rgba(196, 84, 106, 0.14)";

const ENABLED = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

// A small rose dot that trails the system pointer (which stays visible on top)
// and grows into a thin translucent ring over anything clickable. Visual only:
// it never takes pointer events, focus or React state, and only exists for a
// fine pointer on a desktop-width screen. Mark elements with data-cursor="hover" | "default" | "drag"; a
// future data-cursor-label="View" is copied to the cursor but not shown yet.
export default function CustomCursor() {
  const ref = useRef(null);
  const dotRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({ enabled: ENABLED, reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { enabled, reduce } = context.conditions;
      if (!enabled) return;

      const cursor = ref.current;
      const dot = dotRef.current;
      const html = document.documentElement;
      const follow = reduce ? 0 : 0.18; // weighted, not floaty
      const change = reduce ? 0 : 0.3;

      gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const xTo = gsap.quickTo(cursor, "x", { duration: follow, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: follow, ease: "power3.out" });

      const STATES = {
        default: { scale: DOT / RING, backgroundColor: ACCENT },
        hover: { scale: 1, backgroundColor: TINT },
        drag: { scale: GRIP / RING, backgroundColor: ACCENT },
      };
      gsap.set(dot, STATES.default);

      let state = "default";
      let target = null; // the hovered interactive element, for the magnet
      let seen = false; // no dot until the pointer has moved
      let inside = true;
      let native = false;

      const setState = (next) => {
        if (next === state) return;
        state = next;
        gsap.to(dot, { ...STATES[next], duration: change, ease: "power3.out", overwrite: "auto" });
      };

      const visible = () => seen && inside && !native;
      const show = () =>
        gsap.to(cursor, { autoAlpha: visible() ? 1 : 0, duration: reduce ? 0 : 0.2, overwrite: "auto" });

      // Which state the element under the pointer asks for.
      const resolve = (el) => {
        if (!(el instanceof Element)) return { native: false, mode: "default", hit: null };
        if (el.closest(NATIVE)) return { native: true, mode: "default", hit: null };
        const marked = el.closest("[data-cursor]");
        const hit = el.closest(INTERACTIVE);
        // The nearest explicit marker wins over a broader interactive parent.
        if (marked && (!hit || hit.contains(marked))) {
          const mode = marked.dataset.cursor;
          if (mode === "default" || mode === "drag") return { native: false, mode, hit: null };
        }
        return { native: false, mode: hit ? "hover" : "default", hit };
      };

      const onOver = (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        const next = resolve(event.target);
        target = next.hit;
        // Kept on the cursor for a future label (data-cursor-label="View"); not shown yet.
        cursor.dataset.label = target?.dataset.cursorLabel ?? "";
        if (next.native !== native) {
          native = next.native;
          show();
        }
        // The portrait editor marks a grabbable anchor via <html> cursor.
        setState(grabbing() ? "drag" : next.mode);
      };

      // useEditableMask sets html.style.cursor to "grab"/"grabbing" near an
      // anchor; the ring stays a small dot there so the anchor stays visible.
      const grabbing = () => html.style.cursor === "grab" || html.style.cursor === "grabbing";

      const onMove = (event) => {
        if (event.pointerType !== "mouse") return;
        let { clientX: x, clientY: y } = event;

        if (!seen) {
          seen = true;
          gsap.set(cursor, { x, y });
          show();
        }

        if (grabbing()) setState("drag");
        else if (state === "drag") setState(target ? "hover" : "default");

        // A gentle pull toward the centre of small links (text, nav), never
        // more than MAGNET px, so the ring still sits under the pointer.
        if (state === "hover" && target) {
          const r = target.getBoundingClientRect();
          if (r.height <= 64 && r.width <= 280) {
            x += gsap.utils.clamp(-MAGNET, MAGNET, (r.left + r.width / 2 - x) * 0.15);
            y += gsap.utils.clamp(-MAGNET, MAGNET, (r.top + r.height / 2 - y) * 0.15);
          }
        }

        xTo(x);
        yTo(y);
      };

      const onDown = (event) => {
        if (event.pointerType !== "mouse") return;
        gsap.to(cursor, { scale: 0.88, duration: reduce ? 0 : 0.15, ease: "power3.out", overwrite: "auto" });
      };
      const onUp = () => gsap.to(cursor, { scale: 1, duration: reduce ? 0 : 0.3, ease: "power3.out", overwrite: "auto" });

      const onLeave = () => {
        inside = false;
        show();
      };
      const onEnter = () => {
        inside = true;
        show();
      };

      const listeners = [
        [document, "pointerover", onOver],
        [window, "pointermove", onMove],
        [window, "pointerdown", onDown],
        [window, "pointerup", onUp],
        [html, "mouseleave", onLeave],
        [html, "mouseenter", onEnter],
        [window, "blur", onLeave],
      ];
      listeners.forEach(([el, type, fn]) => el.addEventListener(type, fn, { passive: true }));

      return () => {
        listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
        delete cursor.dataset.label;
      };
    });

    return () => mm.revert();
  });

  return (
    <div ref={ref} aria-hidden="true" className={styles.cursor}>
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
