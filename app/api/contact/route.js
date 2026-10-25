import { sendContactMessage } from "@/lib/contact/delivery";
import { validateContact } from "@/lib/contact/validation";

const MAX_BODY_BYTES = 20_000;
// Humans need more than a few seconds to fill the form; bots usually don't.
const MIN_FILL_MS = 3_000;

const reply = (body, status = 200) => Response.json(body, { status });

// POST /api/contact — validates a contact form submission and delivers it.
//   200 { ok: true }                            sent (or quietly dropped as spam)
//   400 { ok: false, error: "invalid", fields }  validation errors by field
//   503 { ok: false, error: "not_configured" }   no email provider set up
//   502 { ok: false, error: "delivery_failed" }  provider rejected or timed out
export async function POST(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ ok: false, error: "unsupported" }, 415);
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return reply({ ok: false, error: "too_large" }, 413);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: "too_large" }, 413);
    body = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return reply({ ok: false, error: "invalid" }, 400);
  }

  // Spam: the hidden "website" field was filled, or the form was submitted
  // implausibly fast. Answer like a success so bots learn nothing; send nothing.
  if (body.website || !(Number(body.elapsed) >= MIN_FILL_MS)) {
    return reply({ ok: true });
  }

  const { ok, data, errors } = validateContact(body);
  if (!ok) return reply({ ok: false, error: "invalid", fields: errors }, 400);

  const result = await sendContactMessage(data);
  if (result.ok) return reply({ ok: true });

  return reply({ ok: false, error: result.reason }, result.reason === "not_configured" ? 503 : 502);
}
