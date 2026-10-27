// Copy for the Journey section's sticky narrative and workflow block.
import { profile } from "@/data/profile";
import { contactDetails } from "@/lib/config/contact";

const { company } = profile.current;

export const journey = {
  heading: "My design journey so far.",
  // Set in the Clash Display accent, like "shape" and "touch" in later sections.
  accentWord: "journey",
  intro: [
    `I'm a Product Designer, currently leading UX/UI at ${company}. Since starting out in 2023, I've moved from designing individual interfaces to owning end-to-end product experiences across healthcare, AI analytics, enterprise automation and mobility.`,
    "My work sits close to product and engineering — turning early requirements and ambiguous problems into flows, systems, prototypes and production-ready interfaces.",
  ],
  // Accessible name of the one-line career progression (levels from
  // data/experience.js, oldest first).
  progressionLabel: "Career progression",
  resume: {
    label: "Resume",
    href: contactDetails.resume,
  },
};

// Tools in the order work flows through them: design → code.
// Add each tool's official SVG logo at `icon`; until the file exists the
// tile shows the tool's name instead.
export const workflow = {
  heading: "Design in Figma. Think with AI. Prototype in React & Next.js.",
  from: "Design",
  to: "Code",
  tools: [
    { name: "Figma", icon: "/icons/tools/figma.svg" },
    { name: "Claude", icon: "/icons/tools/claude.svg" },
    { name: "VS Code", icon: "/icons/tools/vscode.svg" },
    { name: "React", icon: "/icons/tools/react.svg" },
    { name: "Next.js", icon: "/icons/tools/nextjs.svg" },
    { name: "GSAP", icon: "/icons/tools/gsap.svg" },
    { name: "GitHub", icon: "/icons/tools/github.svg" },
  ],
};
