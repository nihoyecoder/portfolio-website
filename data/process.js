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
      "I begin by understanding users, business goals, existing patterns, constraints, and the context behind the problem before deciding what should be designed.",
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
      "Insights become flows, information architecture, wireframes, interaction patterns, and polished interfaces designed around real product needs.",
    image: "/images/process/design.webp",
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    chip: "Build",
    icon: "code",
    heading: "Bring the experience into the product.",
    description:
      "I translate design intent into responsive interfaces, working with components, React, Next.js and motion so the final experience behaves as carefully as it was designed.",
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
      "Design systems, specifications, states, assets and implementation details are organized so engineering can ship accurately and the product can continue to scale.",
    image: "/images/process/handoff.webp",
  },
];
