import { copy } from "./CaseText";
import styles from "./CaseStudy.module.css";

// One part of the story: a short label in the left column, the heading in the
// reading column, then the section's content. `eyebrow` replaces the
// "01 — Label" line (e.g. chapters number themselves "01 / Label").
// `tone="dark"` sets the section on the theme's dark colours.
export default function CaseSection({ id, group, number, label, eyebrow, title, tone, children }) {
  return (
    <section
      id={id}
      data-nav-group={group}
      data-tone={tone}
      aria-labelledby={`${id}-title`}
      className={styles.section}
    >
      <div className={styles.container}>
        <div className={`${styles.grid} ${styles.head}`}>
          <p data-reveal className={`${styles.label} ${styles.side}`}>
            {eyebrow ?? `${number} — ${label}`}
          </p>
          <h2 id={`${id}-title`} data-reveal className={`${styles.title} ${styles.main}`}>
            {copy(title)}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

// Places content in a grid area: "main" (reading column), "wide" or "full".
export function Row({ span = "main", className = "", children }) {
  return (
    <div className={`${styles.grid} ${className}`}>
      <div className={styles[span]}>{children}</div>
    </div>
  );
}
