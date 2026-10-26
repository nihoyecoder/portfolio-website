import { copy, InlineList } from "./CaseText";
import styles from "./CaseStudy.module.css";

// The professional context at the top of a case study: where the work was
// done, Manoj's role, who else was involved, what stage the product is at
// and what he personally owned. Fields come from the study's `context`
// (data/case-studies/*.js) and always appear in this order; anything not
// set is left out, never guessed.
const FIELDS = [
  ["company", "Company"],
  ["role", "Role"],
  ["team", "Team"],
  ["product", "Product"],
  ["status", "Status"],
  ["timeline", "Timeline"],
  ["platforms", "Platforms"],
  ["ownership", "What I owned"],
];

export default function CaseStudyMeta({ context, meta }) {
  // Studies without a `context` keep their own free-form `meta` list.
  const items = context
    ? FIELDS.filter(([key]) => context[key]?.length).map(([key, label]) => ({
        label,
        value: context[key],
        wide: key === "ownership",
      }))
    : (meta ?? []);
  if (!items.length) return null;

  return (
    <dl className={styles.meta}>
      {items.map(({ label, value, wide }) => (
        <div key={label} data-intro className={wide ? styles.metaWide : undefined}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.metaValue}>
            {wide && Array.isArray(value) ? (
              <InlineList items={value} />
            ) : Array.isArray(value) ? (
              value.map((line) => (
                <span key={line} className="block">
                  {copy(line)}
                </span>
              ))
            ) : (
              copy(value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// "0→1 Product" under the category, for products designed from scratch
// (not redesigns).
export function ZeroToOneTag() {
  return (
    <p data-intro className={`${styles.label} ${styles.zeroTag}`}>
      0→1 Product
    </p>
  );
}
