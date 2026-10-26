import { gsap } from "gsap";

// How a held section leaves while the next one slides up over it (Hero →
// Work, Work → Journey, Journey → Contact): its content sinks, tips back on
// its bottom edge like a falling domino, and fades.
const SINK = 0.3; // how far it drops, as a share of the viewport height
const TILT = 60; // degrees it has tipped back by the end
const DEPTH = 1200; // perspective (px) it tips back in

// Builds the exit for `layers`, the children of `host` that fall away
// (backgrounds can stay put), and returns a function that applies the
// cover's progress (0–1). Pass `measure` after a resize to re-measure the
// drop and the hinge.
export function coverExit(host, layers) {
  // Every layer tips around one shared hinge, the host's bottom edge, so
  // they fall back together as a single page rather than each on its own.
  const hinge = (i, el) => `${host.offsetWidth / 2 - el.offsetLeft}px ${host.offsetHeight - el.offsetTop}px`;
  const tip = { transformOrigin: hinge, transformPerspective: DEPTH };

  // lazy: false renders each update right away (after an invalidate GSAP
  // would otherwise write it on the next tick, over the at-rest cleanup below).
  const fall = gsap
    .timeline({ paused: true, defaults: { lazy: false } })
    // Sinks linearly.
    .fromTo(layers, { y: 0 }, { y: () => window.innerHeight * SINK, ease: "none", duration: 1 }, 0)
    // Tips back slowly at first and faster as it goes, the way a domino falls.
    .fromTo(layers, { ...tip, rotationX: 0 }, { ...tip, rotationX: TILT, ease: "power1.in", duration: 1 }, 0)
    // Fades slowly at first (still readable halfway); gone once covered.
    .fromTo(layers, { opacity: 1 }, { opacity: 0, ease: "power1.in", duration: 1 }, 0);

  // At rest, leave no transform on the layers: any transform, even an
  // unmoved one, makes each a stacking context, and on phones that lifted
  // Work's legibility scrim above the project titles. GSAP folds a CSS
  // `translate` (e.g. Work's centred indicator) into its transform and sets
  // `translate: none`, so that is handed back at rest and taken over again
  // while falling.
  let resting = false;
  return (progress, measure = false) => {
    if (measure) fall.invalidate();
    // The hero's cover starts at scroll 0, where ScrollTrigger can report a
    // hair above 0 (e.g. 0.000001): that's still at rest.
    const rest = progress < 0.001;
    if (!rest && resting) layers.forEach((el) => (el.style.translate = "none"));
    fall.progress(rest ? 0 : progress);
    if (rest) layers.forEach((el) => Object.assign(el.style, { transform: "", translate: "" }));
    resting = rest;
  };
}
