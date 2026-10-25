import Image from "next/image";
import { publicFileExists } from "@/lib/assets";
import styles from "./Process.module.css";

// Simple monochrome stage icons (16px, stroke = currentColor).
const ICONS = {
  search: (
    <>
      <circle cx="7" cy="7" r="4.25" />
      <path d="M10.2 10.2 13.5 13.5" />
    </>
  ),
  pen: (
    <>
      <path d="M10.5 2.75 13.25 5.5 5.75 13H3v-2.75z" />
      <path d="M9 4.25 11.75 7" />
    </>
  ),
  code: (
    <>
      <path d="M5.5 4.5 2 8l3.5 3.5" />
      <path d="M10.5 4.5 14 8l-3.5 3.5" />
    </>
  ),
  handoff: (
    <>
      <path d="M2.5 8h10" />
      <path d="M9 4.5 12.5 8 9 11.5" />
    </>
  ),
};

export default function ProcessCard({ step, index }) {
  const hasImage = publicFileExists(step.image);

  return (
    <article
      data-process-card
      aria-labelledby={`process-${step.id}`}
      className={styles.card}
      style={{ zIndex: index + 1 }}
    >
      {/* Content fades as the card recedes; the surface stays solid so it keeps covering the cards behind */}
      <div data-process-content className={styles.cardInner}>
        <div className={styles.visual}>
          {hasImage ? (
            <Image
              src={step.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 92vw"
              className="object-cover"
            />
          ) : (
            <div aria-hidden="true" className={styles.placeholder}>
              <span>
                {step.number} · {step.title} visual
              </span>
              <span>1600 × 1000</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[12px] tracking-[0.04em] text-muted">/{step.number}</span>
            <span className={styles.chip}>
              <span aria-hidden="true" className={styles.chipIcon}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[step.icon] ?? ICONS.search}
                </svg>
              </span>
              {step.chip}
            </span>
          </div>

          <h3
            id={`process-${step.id}`}
            className="mt-5 max-w-[20ch] text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.035em] lg:mt-6 lg:text-[clamp(1.75rem,2.3vw,2.5rem)]"
          >
            {step.heading}
          </h3>
          <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-muted lg:text-base">
            {step.description}
          </p>
        </div>
      </div>
    </article>
  );
}
