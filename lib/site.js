// Site-wide identity and navigation. Edit copy here rather than in components.
// Professional positioning (role, current job, focus) is in data/profile.js.

export const site = {
  name: "Manoj Rawat",
  initials: "MR",
  location: "Pune, India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  availability: "Available for opportunities",
  stack: "React · Next.js · GSAP",
};

// Sections of the home page. Absolute (/#…) so they also work from case
// studies.
export const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#journey" },
];

// Absolute so it also works from case-study pages.
export const contactLink = { label: "Let's talk", href: "/#contact" };
