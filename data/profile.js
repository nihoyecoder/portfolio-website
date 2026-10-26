// Professional positioning: who Manoj is, in one place. The hero, Journey
// intro and page metadata read from here.
//
// The role is the positioning (Product Designer); the current title and
// company come from the newest entry in data/experience.js, so the two
// can't drift apart.
import { experience } from "@/data/experience";

const [current] = experience;

export const profile = {
  role: "Product Designer",
  statement:
    "I design 0→1 digital products, using AI to navigate complexity, explore better directions and make informed product decisions.",
  current: {
    title: current.role,
    company: current.company,
  },
};

// "Manoj Rawat — Product Designer" and its one-line summary: page titles,
// search previews and link cards.
export const seo = {
  title: "Manoj Rawat — Product Designer",
  description:
    "Manoj Rawat is a Product Designer focused on 0→1 digital products, complex UX systems and AI-assisted product design.",
  // No custom domain yet; set one here when it exists.
  url: "https://manojrawatportfolio.vercel.app",
};
