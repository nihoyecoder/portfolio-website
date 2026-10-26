// Content for "How I shape every design project."
//
// Images: 16:10 WebP at the listed path (until a file exists the card shows
// a neutral placeholder). Current photos are from Unsplash (free under the
// Unsplash License, no attribution required):
//   research — UX Indonesia (photo-1586936893354-362ad6ae47ba)
//   design   — Kelly Sikkema (photo-1581291518633-83b4ebd1d83e)
//   build    — Juanjo Jaramillo (photo-1619410283995-43d9134e7656)
//   handoff  — Balázs Kétyi (photo-1558655146-d09347e92766)
// `icon` picks the chip icon: "search" | "pen" | "code" | "handoff".

export const processIntro = {
  heading: "How I shape every design project.",
  // Set in the serif accent, like "journey" in the Journey section.
  accentWord: "shape",
  intro:
    "A clear path from understanding the problem to designing, building, and shipping the right experience.",
};

export const processSteps = [
  {
    id: "research",
    number: "01",
    title: "Research",
    chip: "Research",
    icon: "search",
    heading: "Understand the problem before solutions.",
    description:
      "I start with the requirements, business goals, user problems, existing workflows and constraints. AI helps me synthesise information, explore competitors and sharpen my questions — it doesn't replace understanding real users.",
    image: "/images/process/research.webp",
  },
  {
    id: "design",
    number: "02",
    title: "Design",
    chip: "Design",
    icon: "pen",
    heading: "Turn complexity into clear experiences.",
    description:
      "I structure flows, define interaction logic and compare alternatives until complex products feel simple to use. AI widens the exploration; the judgement, the trade-offs and the final design decisions stay mine.",
    image: "/images/process/design.webp",
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    chip: "Build",
    icon: "code",
    heading: "Close the gap between design and code.",
    description:
      "I turn design intent into working prototypes and interfaces with React, Next.js and GSAP, using AI-assisted development — so I understand how products get built and can design for it.",
    image: "/images/process/build.webp",
  },
  {
    id: "handoff",
    number: "04",
    title: "Handoff",
    chip: "Handoff",
    icon: "handoff",
    heading: "Ship with clarity and consistency.",
    description:
      "Components, states, edge cases, responsive behaviour and interaction intent are documented for engineering — then I stay close through design QA, so what ships matches what was designed.",
    image: "/images/process/handoff.webp",
  },
];
