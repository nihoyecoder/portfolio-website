// Copy and form options for the Contact section. The options are also used by
// the API route to validate submissions, so edit them here only.

export const contactIntro = {
  heading: "Get in touch.",
  // Set in the serif accent, like "journey" and "shape" above.
  accentWord: "touch",
  intro:
    "Have an opportunity, project, collaboration, or just want to say hello? I'd love to hear from you.",
};

export const contactOptions = {
  reasons: [
    "Job opportunity",
    "Freelance project",
    "Product collaboration",
    "Design collaboration",
    "Speaking / networking",
    "Just saying hello",
    "Other",
  ],
  services: [
    "Product Design",
    "UX/UI Design",
    "UX Engineering",
    "Design Systems",
    "Product Strategy",
    "Prototyping",
    "Frontend / Design Implementation",
    "Not sure yet",
  ],
  // Service, budget and timeline are asked only for these reasons — not for
  // a job opportunity, networking or a hello.
  projectReasons: ["Freelance project", "Product collaboration", "Design collaboration"],
  budgets: ["Under ₹50K", "₹50K – ₹1L", "₹1L – ₹3L", "₹3L+", "Let's discuss"],
  timelines: [
    "ASAP",
    "Within 2 weeks",
    "Within a month",
    "1–3 months",
    "3+ months",
    "Flexible",
  ],
};

// The project fields start empty; they only appear for project reasons.
export const contactDefaults = {
  name: "",
  email: "",
  company: "",
  reason: "Job opportunity",
  service: "",
  budget: "",
  timeline: "",
  message: "",
};

export const isProjectReason = (reason) => contactOptions.projectReasons.includes(reason);

// The message prompt follows the reason.
export const messagePlaceholder = (reason) =>
  reason === "Job opportunity"
    ? "Tell me about the role, the team and the product you're building."
    : isProjectReason(reason)
      ? "Tell me about the project, its goals, and where you'd like help."
      : "Tell me a little about what you have in mind.";

export const contactStates = {
  success: {
    title: "Message sent.",
    lines: ["Thanks for reaching out.", "I'll get back to you soon."],
    again: "Send another message",
  },
  error: {
    title: "Something went wrong.",
    body: "Please try again or email me directly.",
  },
};
