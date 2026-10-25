"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, media, useGSAP } from "@/lib/gsap";

// Decorative tool cards hanging from two strings that pass behind the
// portrait (desktop only). Rendered inside the portrait's wrapper so the
// strings sit behind the photo but above the name. HeroMotion draws them in
// as part of the intro; this component adds the idle sway afterwards.
//
// Each string's box spans exactly the gap it crosses — viewport edge ↔
// portrait — in the hero's container units (the portrait column is 25cqw,
// the columns either side 37.5cqw). Inside, an SVG maps that span to 0–1000
// units and the sag to 0–100, so cards can be pinned to exact points on the
// curve with percentages. The path carries on under the portrait, so it still
// reads as one string when the portrait's edge is pulled in.

// Height of a string at x (0–1000): level ends, deepest in the middle.
const sag = (x) => 100 * (1 - ((x - 500) / 500) ** 2);
const round = (n) => Math.round(n * 100) / 100;

// That parabola from x = a to x = b, as one quadratic Bézier.
function stringPath(a, b) {
  const mid = (a + b) / 2;
  const control = sag(a) - 0.0008 * (a - 500) * (mid - a);
  return `M${a} ${round(sag(a))}Q${mid} ${round(control)} ${b} ${round(sag(b))}`;
}

// `at`: where the card hangs along the visible span (0–1). `order`: entrance
// order, nearest the portrait first. `sway`: idle swing in degrees, period in s.
const STRINGS = [
  {
    // Lower left, under the description: from behind the portrait out to the
    // viewport's edge. Deeper sag.
    id: "left",
    path: stringPath(1185, 0),
    box: { left: "calc(-37.5cqw - var(--gutter))", top: "calc(18.5cqw + 48px)", height: "2.4cqw" },
    tools: [
      { name: "React", src: "/images/hero-tools/react.png", at: 0.17, rotation: -1, order: 4, sway: [1, 4.4] },
      { name: "GSAP", src: "/images/hero-tools/gsap.png", at: 0.49, rotation: 1.5, order: 2, sway: [-0.8, 3.8] },
      { name: "M", src: "/images/hero-tools/m-mark.png", at: 0.83, rotation: -0.75, order: 0, sway: [0.9, 4.9] },
    ],
  },
  {
    // Upper right, under the location line: from behind the portrait out past
    // the viewport's edge. Shallower sag.
    id: "right",
    path: stringPath(-185, 1080),
    box: { left: "100%", top: "5.3cqw", height: "2cqw" },
    tools: [
      { name: "Figma", src: "/images/hero-tools/figma.png", at: 0.17, rotation: -1, order: 1, sway: [-1, 4.1] },
      { name: "Claude", src: "/images/hero-tools/claude.png", at: 0.46, rotation: 1, order: 3, sway: [0.8, 4.7] },
      { name: "VS Code", src: "/images/hero-tools/vscode.png", at: 0.75, rotation: -1.5, order: 5, sway: [-0.9, 3.6] },
    ],
  },
];

const TOOLS = STRINGS.flatMap((string) => string.tools);
const LINE = "fill-none stroke-foreground/80 [stroke-width:1.25] [vector-effect:non-scaling-stroke]";

export default function HeroToolStrings() {
  const ref = useRef(null);

  // Idle sway once the intro has finished: each card swings around the point
  // it hangs from and bobs a pixel or so, all on different periods.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${media.motion} and (min-width: 1024px)`, () => {
        const root = ref.current;
        const hero = root.closest("[data-hero]");
        const tools = [...root.querySelectorAll('[data-anim="tool"]')];
        const cards = tools.map((tool) => tool.querySelector("img"));
        let tweens = [];

        // Starts mid-swing — exactly at rest — so nothing jumps.
        const swing = (target, prop, from, to, duration) => {
          const tween = gsap.fromTo(
            target,
            { [prop]: from },
            { [prop]: to, duration, ease: "sine.inOut", repeat: -1, yoyo: true },
          );
          return tween.time(duration / 2);
        };

        const start = () => {
          tweens = tools.flatMap((tool, i) => {
            const { rotation, sway: [angle, period] } = TOOLS[i];
            const lift = i % 2 ? 1.2 : -1.2;
            return [
              swing(tool, "rotation", rotation - angle, rotation + angle, period),
              swing(cards[i], "y", -lift, lift, period * 0.8),
            ];
          });
        };

        // No point animating while the hero is scrolled away.
        const observer = new IntersectionObserver(([entry]) => {
          tweens.forEach((tween) => (entry.isIntersecting ? tween.resume() : tween.pause()));
        });
        observer.observe(hero ?? root);

        if (!hero || hero.hasAttribute("data-intro-done")) start();
        else hero.addEventListener("hero:introdone", start, { once: true });

        return () => {
          hero?.removeEventListener("hero:introdone", start);
          observer.disconnect();
          tweens.forEach((tween) => tween.kill());
          tools.forEach((tool, i) => gsap.set(tool, { rotation: TOOLS[i].rotation }));
          gsap.set(cards, { clearProps: "transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden [--card:clamp(40px,3.8cqw,64px)] [--hang:clamp(8px,0.75cqw,13px)] lg:block"
    >
      {STRINGS.map((string) => (
        <div key={string.id} className="absolute w-[calc(37.5cqw+var(--gutter))]" style={string.box}>
          <svg
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            <path data-anim="string" d={string.path} className={LINE} />
          </svg>
          {string.tools.map((tool) => (
            <HangingTool key={tool.name} tool={tool} />
          ))}
        </div>
      ))}
    </div>
  );
}

// A card on a short thread, pinned to its point on the curve. Rotations pivot
// on that point; the thread runs a few px behind the card so they stay joined
// while the card bobs.
function HangingTool({ tool }) {
  return (
    <div
      data-anim="tool"
      data-order={tool.order}
      className="absolute w-(--card) origin-top"
      style={{
        left: `${tool.at * 100}%`,
        top: `${round(sag(tool.at * 1000))}%`,
        marginLeft: "calc(var(--card) / -2)",
        transform: `rotate(${tool.rotation}deg)`,
      }}
    >
      <svg
        viewBox="0 0 2 10"
        preserveAspectRatio="none"
        className="mx-auto block h-[calc(var(--hang)+3px)] w-0.5 overflow-visible"
      >
        <line x1="1" y1="0" x2="1" y2="10" className={LINE} />
      </svg>
      <Image
        src={tool.src}
        alt=""
        width={62}
        height={78}
        unoptimized
        className="relative -mt-[3px] block h-auto w-full"
      />
    </div>
  );
}
