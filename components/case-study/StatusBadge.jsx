import styles from "./CaseStudy.module.css";

// Where the product is: Live, Pilot or Concept (projects.js → status), next
// to the 0→1 tag. Nothing shows until a status is set.
const TONES = { live: "live", pilot: "pilot", concept: "concept" };

export default function StatusBadge({ status }) {
  if (!status) return null;
  const tone = TONES[status.toLowerCase()];
  return (
    <p data-intro data-tone={tone} className={`${styles.label} ${styles.statusBadge}`}>
      <span aria-hidden="true" className={styles.statusDot} />
      {status}
    </p>
  );
}
