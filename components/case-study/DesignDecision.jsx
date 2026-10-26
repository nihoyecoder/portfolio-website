import { Fragment } from "react";
import CaseMedia from "./CaseMedia";
import Exploration from "./Exploration";
import { Row } from "./CaseSection";
import { copy, Lines, pad } from "./CaseText";
import styles from "./CaseStudy.module.css";

// Readable list for the screen-reader descriptions of the diagrams.
const listOf = (items) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join("; ")}; and ${items[items.length - 1]}`;

// "A, then B, then C" — without a comma after a step ending in ?, ! or .
const stepsOf = (items) =>
  items.reduce((text, item, i) => (i === 0 ? item : `${text}${/[?!.]$/.test(items[i - 1]) ? " Then" : ", then"} ${item}`), "");

// The core of every case study: what was wrong, what I decided, why — then
// the evidence (a before → after model and/or screens), how it was explored
// and what it changed.
// `labels` ({ problem, decision, why, impact }) renames the column labels.
export default function DesignDecision({ decision, number }) {
  const id = `decision-${number}`;
  const labels = decision.labels ?? {};
  const reasons = [
    [labels.problem ?? "Problem", decision.problem],
    [labels.decision ?? "Decision", decision.decision],
    [labels.why ?? "Why", decision.why],
  ].filter(([, text]) => text);
  // What it changed: `impact` (labelled Impact) or the older `outcome` (Result).
  const result = decision.impact ?? decision.outcome;

  return (
    <article aria-labelledby={id} className={styles.decision}>
      <div className={`${styles.grid} ${styles.decisionHead}`}>
        <div data-reveal className={styles.side}>
          <p className={styles.label}>Design decision</p>
          <p aria-hidden="true" className={styles.decisionNumber}>
            {number}
          </p>
          {decision.status && <p className={styles.decisionStatus}>{decision.status}</p>}
        </div>

        <div className={styles.main}>
          <h3 id={id} data-reveal className={styles.decisionTitle}>
            <span className="sr-only">Decision {number}: </span>
            {copy(decision.title)}
          </h3>
          {decision.context && (
            <div data-reveal className={styles.decisionContext}>
              <p className={styles.label}>Context</p>
              <Lines text={decision.context} />
            </div>
          )}
          <dl className={styles.reasons}>
            {reasons.map(([label, text]) => (
              <div key={label} data-reveal>
                <dt className={styles.label}>{label}</dt>
                <dd>
                  <Lines text={text} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {decision.principles?.length > 0 && (
        <Principles label={decision.principlesLabel} items={decision.principles} />
      )}

      {decision.shift && <Shift shift={decision.shift} />}
      {/* One media block, or a list shown one after another */}
      {[].concat(decision.media ?? []).map((media, i) => (
        <CaseMedia key={i} media={media} />
      ))}

      {/* Options explored → what I chose → why, once `exploration` is written. */}
      {decision.exploration && <Exploration decision={decision} />}

      {result && (
        <Row className={styles.block}>
          <div data-reveal className={styles.result}>
            <span className={styles.label}>{decision.impact ? (labels.impact ?? "Impact") : "Result"}</span>
            <div>
              <Lines text={result} />
            </div>
          </div>
        </Row>
      )}
    </article>
  );
}

// Numbered principles (or roles) behind a larger decision: a title, its copy,
// an optional why and an optional one-line principle. Three items sit in
// three columns, otherwise two.
function Principles({ label = "Key UX principles", items }) {
  return (
    <Row className={styles.block}>
      <h4 data-reveal className={styles.label}>
        {label}
      </h4>
      <ol className={`${styles.items} ${styles.principles}`} data-columns={items.length === 3 ? 3 : 2}>
        {items.map((item, i) => (
          <li key={i} data-reveal className={styles.item}>
            <span className={`${styles.label} ${styles.itemNumber}`}>{pad(i + 1)}</span>
            <h5 className={styles.itemTitle}>{copy(item.title)}</h5>
            <div className={styles.itemText}>
              <Lines text={item.text} />
            </div>
            {item.why && (
              <div className={`${styles.itemText} ${styles.principleWhy}`}>
                <span className={styles.label}>Why</span>
                <Lines text={item.why} />
              </div>
            )}
            {item.principle && <p className={styles.principleQuote}>“{copy(item.principle)}”</p>}
          </li>
        ))}
      </ol>
    </Row>
  );
}

// Before → after model, row by row: kept items map straight across, merged
// items are grouped and point at what replaced them, dropped ones are struck.
// `kind: "flow"` instead compares two step sequences side by side.
// `count: false` drops the "· 5 roles" counts (for illustrative examples);
// `summary` overrides the generated screen-reader description.
function Shift({ shift }) {
  if (shift.kind === "flow") return <FlowShift shift={shift} />;

  const unit = shift.unit ?? "items";
  const merges = shift.merges ?? [];
  const counted = shift.count !== false;
  const head = (label, items) => (counted ? `${label} · ${items.length} ${unit}` : label);

  const rows = shift.after.map((item) => {
    const merge = merges.find((candidate) => candidate.into === item);
    if (merge) return { from: merge.from, to: item, merged: true };
    return { from: shift.before.includes(item) ? [item] : [], to: item };
  });
  const placed = new Set(rows.flatMap((row) => row.from));
  const dropped = shift.before.filter((item) => !placed.has(item));

  const summary =
    shift.summary ??
    [
      `${counted ? `Before, ${shift.before.length} ${unit}` : "Before"}: ${listOf(shift.before)}.`,
      `${counted ? `After, ${shift.after.length} ${unit}` : "After"}: ${listOf(shift.after)}.`,
      ...merges.map((merge) => `${merge.from.join(", ").replace(/, ([^,]*)$/, " and $1")} became ${merge.into}.`),
    ].join(" ");

  return (
    <div className={`${styles.grid} ${styles.figure}`}>
      <figure data-reveal="media" className={styles.full}>
        <figcaption className="sr-only">{summary}</figcaption>
        <div aria-hidden="true" className={styles.shift}>
          <p className={`${styles.label} ${styles.shiftHead}`}>{head("Before", shift.before)}</p>
          <span />
          <p className={`${styles.label} ${styles.shiftHead}`}>{head("After", shift.after)}</p>

          {rows.map((row) => (
            <Fragment key={row.to}>
              <div className={styles.shiftCell} data-merged={row.merged || undefined}>
                {row.from.map((item) => (
                  <span key={item} className={styles.shiftItem}>
                    {item}
                  </span>
                ))}
              </div>
              <span className={styles.shiftArrow}>→</span>
              <div className={styles.shiftCell}>
                <span className={styles.shiftItem} data-new={row.merged || row.from.length === 0 || undefined}>
                  {row.to}
                </span>
              </div>
            </Fragment>
          ))}

          {dropped.map((item) => (
            <Fragment key={item}>
              <div className={styles.shiftCell}>
                <span className={styles.shiftItem} data-removed>
                  {item}
                </span>
              </div>
              <span className={styles.shiftArrow}>×</span>
              <span />
            </Fragment>
          ))}
        </div>
      </figure>
    </div>
  );
}

// Two step sequences side by side, e.g. how a journey used to begin and how
// it begins now. The new starting point is highlighted.
function FlowShift({ shift }) {
  const summary = shift.summary ?? `Before: ${stepsOf(shift.before)}. After: ${stepsOf(shift.after)}.`;

  const steps = (items, highlightFirst) => (
    <div className={styles.shiftCell}>
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && <span className={styles.shiftArrow}>↓</span>}
          <span className={styles.shiftItem} data-new={(highlightFirst && i === 0) || undefined}>
            {item}
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={`${styles.grid} ${styles.figure}`}>
      <figure data-reveal="media" className={styles.full}>
        <figcaption className="sr-only">{summary}</figcaption>
        <div aria-hidden="true" className={styles.shift}>
          <p className={`${styles.label} ${styles.shiftHead}`}>Before</p>
          <span />
          <p className={`${styles.label} ${styles.shiftHead}`}>After</p>
          {steps(shift.before, false)}
          <span className={styles.shiftArrow}>→</span>
          {steps(shift.after, true)}
        </div>
      </figure>
    </div>
  );
}
