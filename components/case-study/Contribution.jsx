import { Lines } from "./CaseText";
import styles from "./CaseStudy.module.css";

// What Manoj did himself on work shared with another designer (the study's
// `contribution`), so a recruiter can tell his part from the team's.
export default function Contribution({ text }) {
  if (!text) return null;
  return (
    <div className={styles.contribution}>
      <p className={styles.label}>My contribution vs. the co-designer</p>
      <div className={styles.contributionText}>
        <Lines text={text} />
      </div>
    </div>
  );
}
