import { Row } from "./CaseSection";
import { Lines } from "./CaseText";
import styles from "./CaseStudy.module.css";

// How the design was (or will be) validated, before the outcome: a status,
// what was done or learned, and the next validation step. Honest by design —
// "not yet validated" is a valid status.
export default function Validation({ data }) {
  const rows = [
    ["Status", data.status],
    ["What was done", data.body],
    [data.nextLabel ?? "Next validation step", data.next],
  ].filter(([, text]) => text);

  return (
    <Row className={styles.block}>
      <dl className={styles.validation}>
        {rows.map(([label, text]) => (
          <div key={label} data-reveal>
            <dt className={styles.label}>{label}</dt>
            <dd>
              <Lines text={text} />
            </dd>
          </div>
        ))}
      </dl>
    </Row>
  );
}
