import ExperienceCard from "./ExperienceCard";
import styles from "./Journey.module.css";

export default function JourneyTimeline({ items }) {
  return (
    <div className={styles.timeline}>
      <ol data-journey-list aria-label="Career timeline" className={styles.list}>
        {items.map((item) => (
          <ExperienceCard key={`${item.role}-${item.company}-${item.period}`} item={item} />
        ))}
      </ol>
    </div>
  );
}
