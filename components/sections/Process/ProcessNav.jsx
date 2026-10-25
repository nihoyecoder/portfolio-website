import styles from "./Process.module.css";

// Persistent stage list beside the card stack (stage layout only). Opacity is
// owned by the scroll timeline; clicking a stage scrolls to it.
export default function ProcessNav({ steps }) {
  return (
    <nav aria-label="Process stages" className={styles.nav}>
      <ol className={styles.navList}>
        {steps.map((step, index) => (
          <li key={step.id}>
            <button type="button" data-process-nav data-process-goto={index} className={styles.navButton}>
              <span className="w-7 font-mono text-[12px] tracking-[0.04em] text-muted">{step.number}</span>
              <span className="text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-none tracking-[-0.045em]">
                {step.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
