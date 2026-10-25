// Footer copy and navigation. Links point at sections of the home page;
// contact details and profiles come from lib/config/contact.js.
import { contactDetails } from "@/lib/config/contact";

export const footerIntro = {
  heading: "Let's work together.",
  // Set in the serif accent, like the section headings above.
  accentWord: "together",
  intro:
    "Product design, UX engineering, and digital experiences. Always open to good conversations, interesting products, and ambitious ideas.",
};

// Social profiles, shown only once a URL is set in the contact config.
export const footerSocials = [
  { id: "linkedin", label: "LinkedIn", href: contactDetails.linkedin },
  { id: "github", label: "GitHub", href: contactDetails.github },
].filter((social) => social.href);

// Section links start with "/" so they also work from case-study pages.
export const footerNav = [
  {
    label: "Main",
    links: [
      // "#top" scrolls to the start of the page (HTML spec), no id needed.
      { label: "Home", href: "/#top" },
      { label: "Work", href: "/#work" },
      // No About page yet; the journey section is the "about me".
      { label: "About", href: "/#journey" },
      { label: "Process", href: "/#process" },
    ],
  },
  {
    label: "Links",
    links: [
      { label: "Contact", href: "/#contact" },
      { label: "Resume", href: contactDetails.resume, download: "Manoj-Rawat-Resume.pdf" },
      ...footerSocials.map(({ label, href }) => ({ label, href, external: true })),
    ],
  },
];
