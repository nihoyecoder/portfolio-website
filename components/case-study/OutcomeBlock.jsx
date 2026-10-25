import { Row } from "./CaseSection";
import { copy, paragraphs } from "./CaseText";
import ItemGrid from "./ItemGrid";
import styles from "./CaseStudy.module.css";

// Verified metrics as large figures; otherwise qualitative outcomes and a
// checklist of what the work established. `points` are numbered statements;
// `learning` ({ title, body }) adds a short reflection. Optional `body` opens
// the section, `qualitativeColumns` sets 2 or 3 columns and `closing` ends it
// on one larger statement. Nothing is generated.
export default function OutcomeBlock({ data }) {
  return (
    <>
      {paragraphs(data.body).length > 0 && (
        <Row className={styles.headBody}>
          {paragraphs(data.body).map((text, i) => (
            <p key={i} data-reveal className={styles.body}>
              {copy(text)}
            </p>
          ))}
        </Row>
      )}

      {data.metrics?.length > 0 && (
        <Row className={styles.headBody}>
          <ul className={styles.metrics}>
            {data.metrics.map((metric) => (
              <li key={metric.label} data-reveal>
                <p className={styles.metricValue}>{metric.value}</p>
                <p className={styles.metricLabel}>{copy(metric.label)}</p>
              </li>
            ))}
          </ul>
        </Row>
      )}

      {data.points?.length > 0 && (
        <Row>
          <ItemGrid items={data.points.map((title) => ({ title }))} numbered />
        </Row>
      )}

      {data.qualitative?.length > 0 && (
        <Row>
          <ItemGrid items={data.qualitative} columns={data.qualitativeColumns ?? 2} />
        </Row>
      )}

      {data.highlights?.length > 0 && (
        <Row className={styles.block}>
          <ul className={styles.checklist}>
            {data.highlights.map((highlight) => (
              <li key={highlight} data-reveal>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.check}>
                  <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{copy(highlight)}</span>
              </li>
            ))}
          </ul>
        </Row>
      )}

      {/* What I learned, folded into the outcome for short case studies. */}
      {data.learning && (
        <Row className={styles.block}>
          <h3 data-reveal className={styles.chapterGoal}>
            {copy(data.learning.title)}
          </h3>
          {paragraphs(data.learning.body).map((text, i) => (
            <p key={i} data-reveal className={`${i === 0 ? styles.lead : styles.body} mt-6`}>
              {copy(text)}
            </p>
          ))}
        </Row>
      )}

      {data.closing && (
        <Row className={styles.block}>
          <p data-reveal className={styles.closing}>
            {copy(data.closing)}
          </p>
        </Row>
      )}
    </>
  );
}
