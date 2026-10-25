import { gsap } from "gsap";

// How a held section leaves while the next one slides up over it (Hero →
// Work, Work → Journey, Process → Contact): its content sinks, tips back on
// its bottom edge like a falling domino, and fades.
const SINK = 0.3; // how far it drops, as a share of the viewport height
const TILT = 60; // degrees it has tipped back by the end
const DEPTH = 1200; // perspective (px) it tips back in

// A paused timeline for `layers`, the children of `host` that fall away
// (backgrounds can stay put). Scrub it with .progress() over the cover;
// .invalidate() after a resize re-measures the drop and the hinge.
export function coverExit(host, layers) {
  // Every layer tips around one shared hinge, the host's bottom edge, so
  // they fall back together as a single page rather than each on its own.
  const hinge = (i, el) => `${host.offsetWidth / 2 - el.offsetLeft}px ${host.offsetHeight - el.offsetTop}px`;
  const tip = { transformOrigin: hinge, transformPerspective: DEPTH };

  return (
    gsap
      .timeline({ paused: true })
      // Sinks linearly.
      .fromTo(layers, { y: 0 }, { y: () => window.innerHeight * SINK, ease: "none", duration: 1 }, 0)
      // Tips back slowly at first and faster as it goes, the way a domino falls.
      .fromTo(layers, { ...tip, rotationX: 0 }, { ...tip, rotationX: TILT, ease: "power1.in", duration: 1 }, 0)
      // Fades slowly at first (still readable halfway); gone once covered.
      .fromTo(layers, { opacity: 1 }, { opacity: 0, ease: "power1.in", duration: 1 }, 0)
  );
}
