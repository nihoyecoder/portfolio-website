import ExperienceCard from "./ExperienceCard";
import styles from "./Journey.module.css";

// Role cards, then training (e.g. an apprenticeship) as one small line after
// them — not a card, so it isn't part of the active-card choreography.
export default function JourneyTimeline({ items }) {
  const roles = items.filter((item) => !item.training);
  const training = items.filter((item) => item.training);

  return (
    <div className={styles.timeline}>
      <ol data-journey-list aria-label="Career timeline" className={styles.list}>
        {roles.map((item) => (
          <ExperienceCard key={`${item.role}-${item.company}-${item.period}`} item={item} />
        ))}
        {training.map((item) => (
          <li key={`${item.role}-${item.company}`} className={styles.training}>
            <span className={styles.trainingLabel}>Training</span> {item.role}, {item.company} · {item.period}
          </li>
        ))}
      </ol>
    </div>
  );
}
