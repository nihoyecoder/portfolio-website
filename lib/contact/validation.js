// Contact form rules, shared by the form (instant feedback) and the API
// route (the real gate). Plain JS so it runs in both environments.
import { contactOptions, isProjectReason } from "@/data/contact";

export const LIMITS = { name: 100, email: 254, company: 200, message: 5000 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CHOICES = {
  reason: contactOptions.reasons,
  service: contactOptions.services,
  budget: contactOptions.budgets,
  timeline: contactOptions.timelines,
};

// Single-line fields: trim and collapse whitespace (no line breaks in names
// or email subjects).
const line = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

export function validateContact(input = {}) {
  const reason = line(input.reason);
  // Service, budget and timeline only count for project reasons.
  const project = isProjectReason(reason);
  const data = {
    name: line(input.name),
    email: line(input.email),
    company: line(input.company),
    reason,
    service: project ? line(input.service) : "",
    budget: project ? line(input.budget) : "",
    timeline: project ? line(input.timeline) : "",
    message: String(input.message ?? "").trim(),
  };

  const errors = {};

  if (!data.name) errors.name = "Please enter your name.";
  else if (data.name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!data.email) errors.email = "Please enter your email address.";
  else if (data.email.length > LIMITS.email || !EMAIL.test(data.email))
    errors.email = "Please enter a valid email address, like you@company.com.";

  if (data.company.length > LIMITS.company)
    errors.company = `Please keep this under ${LIMITS.company} characters.`;

  // Optional selects: empty is fine, anything else must be a listed option.
  for (const [field, options] of Object.entries(CHOICES)) {
    if (data[field] && !options.includes(data[field])) errors[field] = "Please choose one of the options.";
  }

  if (!data.message) errors.message = "Please add a short message.";
  else if (data.message.length > LIMITS.message)
    errors.message = `Please keep your message under ${LIMITS.message.toLocaleString("en")} characters.`;

  return { ok: Object.keys(errors).length === 0, data, errors };
}
