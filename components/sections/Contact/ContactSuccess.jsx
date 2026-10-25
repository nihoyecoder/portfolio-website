"use client";

import { useEffect, useRef } from "react";
import { contactStates } from "@/data/contact";
import { CheckIcon } from "./icons";
import styles from "./Contact.module.css";

// Replaces the form once a message is delivered. Focus moves to the heading
// so screen readers announce the result.
export default function ContactSuccess({ onReset }) {
  const headingRef = useRef(null);
  const { title, lines, again } = contactStates.success;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={styles.success}>
      <span className={styles.successIcon}>
        <CheckIcon width="20" height="20" />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className={styles.successTitle}>
        {title}
      </h3>
      <p className={styles.successBody}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <button type="button" onClick={onReset} className={styles.secondary}>
        {again}
      </button>
    </div>
  );
}
