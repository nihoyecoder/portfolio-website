import styles from "./Journey.module.css";

// One career entry plus its dot on the timeline rail.
export default function ExperienceCard({ item }) {
  return (
    <li data-journey-item className={styles.item}>
      <article className={styles.card}>
        {/* The title stays on one line; the company takes what's left beside
            it (sm and up), or goes under the title on phones, where both
            don't fit side by side. Balanced if a very narrow phone still
            wraps it. */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <h3 className="text-balance text-[1.25rem] font-semibold leading-tight tracking-[-0.03em] sm:whitespace-nowrap xl:text-[1.375rem]">
            {item.role}
          </h3>
          <p className="text-sm leading-snug text-muted sm:max-w-[45%] sm:pt-1 sm:text-right">{item.company}</p>
        </div>
        {item.promotedFrom && (
          <p className="mt-2 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.08em] text-accent-strong">
            <span aria-hidden="true">↑</span> Promoted from {item.promotedFrom}
          </p>
        )}
        <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-muted">{item.description}</p>
        {item.scope && (
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed">
            <span className="mr-2 text-[10.5px] uppercase tracking-[0.08em] text-muted">Scope</span>
            {item.scope}
          </p>
        )}
        <p className={`${styles.period} mt-6`}>{item.period}</p>
      </article>
      <span aria-hidden="true" className={styles.dot} />
    </li>
  );
}
