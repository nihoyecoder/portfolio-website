// Professional positioning: who Manoj is, in one place. The hero, Journey
// intro and page metadata read from here.
//
// The headline is the title under the name in the homepage hero; the role is
// the positioning elsewhere (the home link-preview image). The current title
// and company come from the newest entry in data/experience.js, so the two
// can't drift apart.
import { experience } from "@/data/experience";

const [current] = experience;

export const profile = {
  headline: "AI Product Design Engineer",
  role: "AI Product Designer",
  statement:
    "I design 0→1 products and build design systems in Figma, explore flows and edge cases with ChatGPT, prototype interactions with Claude Code and Figma MCP.",
  current: {
    title: current.role,
    company: current.company,
  },
};

// "Manoj Rawat — AI Product Designer" and its one-line summary: page titles,
// search previews and link cards.
export const seo = {
  title: "Manoj Rawat — AI Product Designer",
  description:
    "Manoj Rawat is an AI Product Designer focused on 0→1 digital products, complex UX systems and AI-assisted product design.",
  // No custom domain yet; set one here when it exists.
  url: "https://manojrawatportfolio.vercel.app",
};
