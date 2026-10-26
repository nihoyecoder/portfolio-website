import Contribution from "./Contribution";
import { copy, paragraphs } from "./CaseText";
import styles from "./CaseStudy.module.css";

// The case study in one card, right under the hero, for a reader with 30
// seconds: the problem, Manoj's role, the team, three key decisions and the
// result. Reuses the study's own content — the challenge statement, the
// context block and the first three decision headings — unless `tldr`
// overrides a field; anything unknown is left out.
export default function TLDR({ project, study }) {
  const tldr = study.tldr ?? {};
  const problem = tldr.problem ?? study.challenge?.statement;
  const role = study.context?.role;
  const team = study.context?.team;
  const decisions = tldr.decisions ?? (study.decisions ?? []).slice(0, 3).map((decision) => decision.title);
  const result = tldr.result ?? [project.status, project.outcome].filter(Boolean);

  const rows = [
    ["Problem", problem],
    ["My role", role],
    ["Team", team],
  ].filter(([, value]) => value);

  return (
    <section aria-label={`${project.title} in short`} className={styles.tldrSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div data-reveal className={`${styles.full} ${styles.tldr}`}>
            <p className={`${styles.label} ${styles.tldrTitle}`}>TL;DR</p>
            <dl className={styles.tldrList}>
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt className={styles.label}>{label}</dt>
                  <dd>{copy(value)}</dd>
                </div>
              ))}
              {decisions.length > 0 && (
                <div className={styles.tldrWide}>
                  <dt className={styles.label}>{decisions.length === 3 ? "3 key decisions" : "Key decisions"}</dt>
                  <dd>
                    <ol className={styles.tldrDecisions}>
                      {decisions.map((title) => (
                        <li key={title}>{copy(title)}</li>
                      ))}
                    </ol>
                  </dd>
                </div>
              )}
              {paragraphs(result).length > 0 && (
                <div className={styles.tldrWide}>
                  <dt className={styles.label}>Result / status</dt>
                  <dd>
                    {paragraphs(result).map((line, i) => (
                      <span key={i} className="block">
                        {copy(line)}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            <Contribution text={study.contribution} />
          </div>
        </div>
      </div>
    </section>
  );
}
