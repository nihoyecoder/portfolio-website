// Server-only: delivers a validated contact message by email.
//
// Uses Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email)
// through fetch, so no SDK is installed. Configure in .env.local / your host:
//   RESEND_API_KEY      API key from resend.com
//   CONTACT_TO_EMAIL    inbox that receives the messages
//   CONTACT_FROM_EMAIL  sender on a domain verified in Resend,
//                       e.g. "Portfolio <hello@yourdomain.com>"
// To use another provider, replace the body of sendContactMessage and keep
// its return shape.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isDeliveryConfigured() {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  return Boolean(RESEND_API_KEY && CONTACT_TO_EMAIL && CONTACT_FROM_EMAIL);
}

// Resolves to { ok: true } or { ok: false, reason: "not_configured" | "delivery_failed" }.
export async function sendContactMessage(message) {
  if (!isDeliveryConfigured()) return { ok: false, reason: "not_configured" };

  const subject = `Portfolio: ${message.reason || "New message"} from ${message.name}`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: message.email,
        subject: subject.slice(0, 200),
        text: formatMessage(message),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`[contact] Resend responded ${response.status}: ${await response.text().catch(() => "")}`);
      return { ok: false, reason: "delivery_failed" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return { ok: false, reason: "delivery_failed" };
  }
}

function formatMessage(message) {
  const rows = [
    ["Name", message.name],
    ["Email", message.email],
    ["Company / Website", message.company],
    ["Reason", message.reason],
    ["Service needed", message.service],
    ["Budget", message.budget],
    ["Timeline", message.timeline],
  ].filter(([, value]) => value);

  return [
    "New message from your portfolio contact form.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message.message,
  ].join("\n");
}
