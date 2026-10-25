// Site-wide identity and navigation. Edit copy here rather than in components.

export const site = {
  name: "Manoj Rawat",
  initials: "MR",
  role: { primary: "Product Designer", secondary: "AI-Augmented Developer" },
  statement:
    "I design 0 to 1 products, using AI to turn complexity into experiences for real users.",
  location: "Pune, India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  availability: "Available for opportunities",
  focus: ["Product Design", "UX/UI", "Design Systems", "Frontend"],
  stack: "React · Next.js · GSAP",
};

// Sections of the home page. Absolute (/#…) so they also work from case
// studies.
export const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#journey" },
  { label: "Process", href: "/#process" },
];

// Absolute so it also works from case-study pages.
export const contactLink = { label: "Let's talk", href: "/#contact" };
