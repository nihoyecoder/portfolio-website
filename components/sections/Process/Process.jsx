import { Fragment } from "react";
import { processIntro, processSteps } from "@/data/process";
import ProcessMotion from "./ProcessMotion";
import ProcessStage from "./ProcessStage";
import styles from "./Process.module.css";

export default function Process() {
  const words = processIntro.heading.split(" ");

  return (
    <ProcessMotion id="process" aria-labelledby="process-heading" className={styles.root}>
      <div className={styles.container}>
        <header data-process-header className="mb-12 lg:mb-20">
          <h2
            id="process-heading"
            className="max-w-[14ch] text-[clamp(2.75rem,12vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[clamp(3rem,min(5.6vw,10svh),5.75rem)]"
          >
            {words.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                {/* Mask with room for descenders (p, j) */}
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <span
                    data-process-word
                    className={
                      word === processIntro.accentWord
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
          <p data-process-fade className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-muted">
            {processIntro.intro}
          </p>
        </header>

        <ProcessStage steps={processSteps} />
      </div>
    </ProcessMotion>
  );
}
