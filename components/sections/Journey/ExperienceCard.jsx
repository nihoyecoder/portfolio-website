import styles from "./Journey.module.css";

// One career entry plus its dot on the timeline rail.
export default function ExperienceCard({ item }) {
  return (
    <li data-journey-item className={styles.item}>
      <article className={styles.card}>
        <div className="flex items-start justify-between gap-6">
          <h3 className="text-[1.25rem] font-semibold leading-tight tracking-[-0.03em] xl:text-[1.375rem]">
            {item.role}
          </h3>
          <p className="max-w-[45%] pt-1 text-right text-sm leading-snug text-muted">{item.company}</p>
        </div>
        {item.promotedFrom && (
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-accent-strong">
            <span aria-hidden="true">↑</span> Promoted from {item.promotedFrom}
          </p>
        )}
        <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-muted">{item.description}</p>
        {item.scope && (
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed">
            <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">Scope</span>
            {item.scope}
          </p>
        )}
        <p className={`${styles.period} mt-6`}>{item.period}</p>
      </article>
      <span aria-hidden="true" className={styles.dot} />
    </li>
  );
}
