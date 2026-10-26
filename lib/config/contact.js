// Contact configuration — the one place to edit how people reach Manoj.
// Leave a value empty ("") to hide it on the site.
import { site } from "@/lib/site";

export const contactDetails = {
  // Public address, offered as the fallback when the form can't send
  // ("…or email me directly"). Not where form messages are delivered —
  // that's CONTACT_TO_EMAIL in .env.local.
  email: "manojsinghrawat0003@gmail.com",
  phone: "+91 7983383512",
  // Social profiles appear in the footer only once a URL is set.
  linkedin: "https://www.linkedin.com/in/manoj-singh-rawat/",
  github: "", // e.g. "https://github.com/your-handle"
  location: site.location,
  // The résumé on Google Drive (opens Drive's viewer in a new tab).
  resume: "https://drive.google.com/file/d/136-ul_izI2wLRYEP47xTTfnqtAk1rTB3/view?usp=sharing",
};

// Résumé and LinkedIn, opened in a new tab from the header, the mobile menu
// and the contact section (only the ones that are set).
export const profileLinks = [
  { label: "Resume", href: contactDetails.resume },
  { label: "LinkedIn", href: contactDetails.linkedin },
].filter((link) => link.href);

// ---- Cal.com booking ----
// Set NEXT_PUBLIC_CAL_LINK in .env.local (and in your host's environment
// variables) to your event's path — the part after cal.com/, e.g.
// "manoj-rawat/15min". A full URL works too. Until it's set, the booking
// panel shows a setup notice instead of the scheduler.
const CAL_LINK_PLACEHOLDER = "your-cal-username/15min";

const calLink = normalizeCalLink(process.env.NEXT_PUBLIC_CAL_LINK);
const calOrigin = process.env.NEXT_PUBLIC_CAL_ORIGIN || "https://app.cal.com"; // EU accounts: https://app.cal.eu

export const cal = {
  link: calLink,
  placeholder: CAL_LINK_PLACEHOLDER,
  configured: Boolean(calLink) && calLink !== CAL_LINK_PLACEHOLDER,
  origin: calOrigin,
  embedScript: `${calOrigin}/embed/embed.js`,
  // Public booking page, offered only if the embed fails to load.
  pageUrl: calLink ? `${calOrigin.replace("app.", "")}/${calLink}` : "",
};

// Accepts "user/event", "/user/event" or "https://cal.com/user/event".
function normalizeCalLink(value = "") {
  return value
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^(app\.)?cal\.(com|eu)\//, "")
    .replace(/^\/+|\/+$/g, "");
}
