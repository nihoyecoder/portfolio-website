// Copy for the Journey section's sticky narrative and workflow block.
import { contactDetails } from "@/lib/config/contact";

export const journey = {
  heading: "My design journey so far.",
  // Set in the serif accent, echoing "AI-Augmented Developer" in the hero.
  accentWord: "journey",
  intro:
    "I started in UX/UI and gradually moved deeper into product thinking, design systems and frontend development — designing complex digital products while increasingly building the experiences behind them.",
  resume: {
    label: "Download Resume",
    href: contactDetails.resume,
    fileName: "Manoj-Rawat-Resume.pdf",
  },
};

// Tools in the order work flows through them: design → code.
// Add each tool's official SVG logo at `icon`; until the file exists the
// tile shows the tool's name instead.
export const workflow = {
  heading: "What I use in my workflow",
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
