"use client";

import { useRef } from "react";
import { gsap, media, useGSAP } from "@/lib/gsap";
import styles from "./Header.module.css";

// Only scrolls that follow the visitor's own input — soon after it, and in
// the direction it asked for — move the header. Programmatic scrolls
// (Selected Work snapping back to a project, indicator clicks) don't.
const INPUT_WINDOW = 250; // ms
const TOP = 8; // px from the top where the header always shows, transparent

// Keys that scroll the page, and which way (1 = down).
const KEYS = { ArrowDown: 1, PageDown: 1, End: 1, " ": 1, ArrowUp: -1, PageUp: -1, Home: -1 };

// The fixed <header>: hides while scrolling down, comes back while scrolling
// up, and turns into a compact bar away from the top. No React state; the
// scroll handler only flips data attributes and starts a tween on change.
export default function HeaderShell({ intro = false, children }) {
  const ref = useRef(null);

  useGSAP(() => {
    const header = ref.current;
    const reduce = window.matchMedia(media.reduced).matches;
    let hidden = false;
    let lastY = window.scrollY;
    let lastInput = 0;
    let intent = 0; // the direction the last input scrolls: 1 down, -1 up
    let touchY = 0;
    let held = false; // pointer down, e.g. dragging the scrollbar

    const setHidden = (next) => {
      // Never hide what keyboard focus is on.
      if (next && header.querySelector(":focus-visible")) return;
      if (next === hidden) return;
      hidden = next;
      gsap.to(header, {
        yPercent: next ? -100 : 0,
        duration: reduce ? 0 : next ? 0.35 : 0.5,
        ease: next ? "power2.in" : "power3.out",
        overwrite: true,
        // No transform left while shown: it would make the mobile menu's
        // fixed panel position against the header instead of the screen.
        onComplete: next ? undefined : () => gsap.set(header, { clearProps: "transform" }),
      });
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      header.toggleAttribute("data-scrolled", y > TOP);
      if (y <= TOP) setHidden(false);
      else if (!dy) return;
      else if (held || (performance.now() - lastInput < INPUT_WINDOW && Math.sign(dy) === intent)) setHidden(dy > 0);
    };

    const onInput = (direction) => {
      if (!direction) return;
      intent = direction;
      lastInput = performance.now();
    };
    const onWheel = (event) => onInput(Math.sign(event.deltaY));
    const onKey = (event) => onInput(event.key === " " && event.shiftKey ? -1 : KEYS[event.key]);
    const onTouchStart = (event) => {
      touchY = event.touches[0].clientY;
    };
    // A finger moving up scrolls the page down.
    const onTouchMove = (event) => {
      const y = event.touches[0].clientY;
      onInput(Math.sign(touchY - y));
      touchY = y;
    };
    const onDown = () => {
      held = true;
    };
    const onUp = () => {
      held = false;
    };
    // Tabbing into a hidden header brings it back.
    const onFocus = () => setHidden(false);

    const listeners = [
      [window, "scroll", onScroll],
      [window, "wheel", onWheel],
      [window, "touchstart", onTouchStart],
      [window, "touchmove", onTouchMove],
      [window, "keydown", onKey],
      [window, "pointerdown", onDown],
      [window, "pointerup", onUp],
      [header, "focusin", onFocus],
    ];
    listeners.forEach(([el, type, fn]) => el.addEventListener(type, fn, { passive: true }));
    onScroll();

    return () => listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
  });

  return (
    <header ref={ref} data-site-header data-intro={intro || undefined} className={styles.header}>
      {children}
    </header>
  );
}
