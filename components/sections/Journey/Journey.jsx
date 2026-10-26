import { Fragment } from "react";
import { experience } from "@/data/experience";
import { journey } from "@/data/journey";
import JourneyMotion from "./JourneyMotion";
import JourneyTimeline from "./JourneyTimeline";
import WorkflowTools from "./WorkflowTools";
import styles from "./Journey.module.css";
import ArrowIcon from "@/components/ui/ArrowIcon";

// Career timeline on the left, a sticky narrative on the right that ends in
// the workflow tools. Layout lives in Journey.module.css; all motion lives in
// JourneyMotion.
export default function Journey() {
  return (
    <JourneyMotion id="journey" aria-labelledby="journey-heading" className={styles.root}>
      <div data-journey-container className={styles.container}>
        <div className={styles.layout}>
          <div data-journey-panel className={styles.panel}>
            <JourneyIntro />
            <WorkflowTools />
          </div>

          <div aria-hidden="true" className={styles.rail} />

          <JourneyTimeline items={experience} />
        </div>
      </div>
    </JourneyMotion>
  );
}

function JourneyIntro() {
  const words = journey.heading.split(" ");

  return (
    <div data-journey-intro className={styles.intro}>
      <h2
        id="journey-heading"
        className="max-w-[12ch] text-[clamp(2.75rem,12vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[clamp(2.75rem,min(5.2vw,9svh),5.25rem)]"
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            {/* Mask with room for descenders (j, y) */}
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
              <span
                data-journey-word
                className={
                  word === journey.accentWord
                    ? "inline-block pr-[0.04em] font-serif text-[1.08em] font-normal tracking-[-0.01em] text-accent"
                    : "inline-block"
                }
              >
                {word}
              </span>
            </span>
          </Fragment>
        ))}
      </h2>

      <p data-journey-fade className="mt-6 max-w-[40ch] text-[17px] leading-relaxed text-muted">
        {journey.intro}
      </p>

      <div data-journey-fade className="mt-8">
        <a
          href={journey.resume.href}
          download={journey.resume.fileName}
          className="group inline-flex items-center gap-3 rounded-[3px] border border-accent bg-accent px-5 py-3.5 text-sm text-white transition-colors duration-500 hover:bg-transparent hover:text-accent"
        >
          {journey.resume.label}
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:translate-y-0.5"
          >
            <ArrowIcon direction="down" />
          </span>
        </a>
      </div>
    </div>
  );
}
