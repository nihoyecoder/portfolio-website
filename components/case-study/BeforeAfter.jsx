import CaseImage from "./CaseImage";
import { copy } from "./CaseText";
import styles from "./CaseStudy.module.css";

// Two states side by side (stacked on phones), each clearly labelled.
export default function BeforeAfter({ before, after }) {
  return (
    <div className={styles.columns} data-count="2">
      {[
        ["Before", before],
        ["After", after],
      ].map(([label, image]) => (
        <div key={label}>
          <p className={`${styles.label} ${styles.badge}`}>{label}</p>
          <CaseImage image={image} sizes="(min-width: 768px) 46vw, 94vw" reveal />
          {image.caption && <p className={styles.caption}>{copy(image.caption)}</p>}
        </div>
      ))}
    </div>
  );
}
