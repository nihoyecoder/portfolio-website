"use client";

import { useRef, useState } from "react";
import { contactDefaults, contactOptions, contactStates, isProjectReason, messagePlaceholder } from "@/data/contact";
import { LIMITS, validateContact } from "@/lib/contact/validation";
import ContactSuccess from "./ContactSuccess";
import { AlertIcon, ArrowIcon, ChevronIcon } from "./icons";
import styles from "./Contact.module.css";

const FIELD_ORDER = ["name", "email", "company", "reason", "service", "budget", "timeline", "message"];
const fieldId = (name) => `contact-${name}`;

// The enquiry form. It stays mounted while "Book a call" is shown, so
// anything typed survives switching modes.
export default function ContactForm({ email }) {
  const formRef = useRef(null);
  const startedAt = useRef(0); // first focus; lets the API spot instant bot submissions
  const [values, setValues] = useState(contactDefaults);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [failure, setFailure] = useState(null);

  const submitting = status === "submitting";

  const focusField = (name) =>
    requestAnimationFrame(() => formRef.current?.elements.namedItem(name)?.focus());

  const onChange = (event) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Once a field shows an error, re-check it as it's being fixed.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateContact(next).errors[name] }));
  };

  // Format problems show when leaving a filled field; "required" waits for submit.
  const onBlur = (event) => {
    const { name, value } = event.target;
    if (value.trim()) setErrors((current) => ({ ...current, [name]: validateContact(values).errors[name] }));
  };

  const onFocus = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const { ok, data, errors: found } = validateContact(values);
    if (!ok) {
      setErrors(found);
      focusField(FIELD_ORDER.find((name) => found[name]));
      return;
    }

    setStatus("submitting");
    setFailure(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: new FormData(formRef.current).get("website") || "",
          elapsed: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.ok) {
        setStatus("success");
        return;
      }
      if (response.status === 400 && result.fields) {
        setErrors(result.fields);
        setStatus("idle");
        focusField(FIELD_ORDER.find((name) => result.fields[name]));
        return;
      }
      setFailure(result.error || "unknown");
    } catch {
      setFailure("network");
    }
    setStatus("error");
  }

  const reset = () => {
    setValues(contactDefaults);
    setErrors({});
    setFailure(null);
    setStatus("idle");
    startedAt.current = 0;
    focusField("name");
  };

  if (status === "success") return <ContactSuccess onReset={reset} />;

  // Shared props for every control: value, handlers and error wiring.
  const bind = (name) => ({
    id: fieldId(name),
    name,
    value: values[name],
    onChange,
    onBlur,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${fieldId(name)}-error` : undefined,
  });

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onFocus={onFocus} className={styles.form}>
      {/* Two rows of fields, plus two more for project details */}
      <div className={styles.fields} style={{ "--rows": isProjectReason(values.reason) ? 4 : 2 }}>
        <Field name="name" label="Name" required error={errors.name}>
          <input
            {...bind("name")}
            type="text"
            required
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder="Your name"
            className={styles.control}
          />
        </Field>

        <Field name="email" label="Email" required error={errors.email}>
          <input
            {...bind("email")}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            maxLength={LIMITS.email}
            placeholder="you@company.com"
            className={styles.control}
          />
        </Field>

        <Field name="company" label="Company / Website" error={errors.company}>
          <input
            {...bind("company")}
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            placeholder="Company, product, or URL"
            className={styles.control}
          />
        </Field>

        <Field name="reason" label="Reason for reaching out" error={errors.reason}>
          <Select {...bind("reason")} options={contactOptions.reasons} />
        </Field>

        {/* Project details only for freelance work and collaborations */}
        {isProjectReason(values.reason) && (
          <>
            <Field name="service" label="Service needed" optional full error={errors.service}>
              <Select {...bind("service")} options={contactOptions.services} placeholder="Choose a service" />
            </Field>

            <Field name="budget" label="Budget" optional error={errors.budget}>
              <Select {...bind("budget")} options={contactOptions.budgets} placeholder="Choose a budget" />
            </Field>

            <Field name="timeline" label="Timeline" optional error={errors.timeline}>
              <Select {...bind("timeline")} options={contactOptions.timelines} placeholder="Choose a timeline" />
            </Field>
          </>
        )}

        <Field name="message" label="Tell me a little more" required full grow error={errors.message}>
          <textarea
            {...bind("message")}
            required
            rows={5}
            maxLength={LIMITS.message}
            placeholder={messagePlaceholder(values.reason)}
            className={`${styles.control} ${styles.textarea}`}
          />
        </Field>
      </div>

      {/* Spam trap: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className={styles.trap}>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className={styles.actions}>
        {status === "error" && <FailureNotice email={email} failure={failure} />}
        <button type="submit" aria-disabled={submitting || undefined} className={styles.submit}>
          {submitting ? "Sending…" : "Send message"}
          {!submitting && <ArrowIcon className={styles.submitArrow} />}
        </button>
      </div>

      <p role="status" className="sr-only">
        {submitting ? "Sending your message…" : ""}
      </p>
    </form>
  );
}

function Field({ name, label, required, optional, full, grow, error, children }) {
  const id = fieldId(name);
  return (
    <div className={[styles.field, full && styles.full, grow && styles.grow].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span aria-hidden="true" className={styles.required}>
            *
          </span>
        )}
        {optional && (
          <>
            <span aria-hidden="true" className={styles.optional}>
              Optional
            </span>
            <span className="sr-only">(optional)</span>
          </>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <AlertIcon className={styles.errorIcon} />
          {error}
        </p>
      )}
    </div>
  );
}

function Select({ options, placeholder, ...props }) {
  return (
    <div className={styles.selectWrap}>
      <select {...props} data-empty={props.value === "" || undefined} className={`${styles.control} ${styles.select}`}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronIcon className={styles.chevron} />
    </div>
  );
}

function FailureNotice({ email, failure }) {
  const { title, body } = contactStates.error;
  return (
    <div role="alert" className={styles.notice}>
      <AlertIcon className={styles.noticeIcon} />
      <div>
        <p className={styles.noticeTitle}>{title}</p>
        <p>
          {email ? (
            <>
              {body.replace(/\.$/, "")} at{" "}
              <a href={`mailto:${email}`} className={styles.link}>
                {email}
              </a>
              .
            </>
          ) : (
            body
          )}
        </p>
        {process.env.NODE_ENV !== "production" && failure === "not_configured" && (
          <p className={styles.devHint}>
            Dev note: email delivery isn&apos;t configured. Add RESEND_API_KEY, CONTACT_TO_EMAIL and
            CONTACT_FROM_EMAIL to .env.local (see .env.example).
          </p>
        )}
      </div>
    </div>
  );
}
