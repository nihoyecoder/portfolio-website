import { Row } from "./CaseSection";
import { copy, paragraphs } from "./CaseText";
import styles from "./CaseStudy.module.css";

// A swatch is one `hex`, or a `palette` of hexes shown as equal stripes.
const swatchFill = (color) =>
  color.palette
    ? {
        background: `linear-gradient(90deg, ${color.palette
          .map((hex, i, all) => `${hex} ${(i / all.length) * 100}% ${((i + 1) / all.length) * 100}%`)
          .join(", ")})`,
      }
    : color.hex
      ? { backgroundColor: color.hex }
      : undefined;

// The reasoning behind the look: a guiding principle, then each colour and
// foundation with why it was chosen — not just a palette specimen. `token`
// names the design-file variable a colour comes from.
export default function VisualLanguage({ data }) {
  return (
    <>
      <Row className={data.title ? styles.block : styles.headBody}>
        {/* A subheading when this sits inside another section (design system). */}
        {data.title && (
          <h3 data-reveal className={styles.chapterGoal}>
            {copy(data.title)}
          </h3>
        )}
        {data.principle && (
          <div data-reveal>
            <p className={styles.label}>Principle</p>
            <p className={styles.principle}>{copy(data.principle)}</p>
          </div>
        )}
        {paragraphs(data.body).map((text, i) => (
          <p key={i} data-reveal className={`${styles.body} ${i === 0 ? styles.headBody : ""}`}>
            {copy(text)}
          </p>
        ))}
      </Row>

      {data.colors?.length > 0 && (
        <Row span="wide" className={styles.block}>
          <h3 className={`${styles.label} mb-6`}>Colour</h3>
          <ul className={styles.swatches}>
            {data.colors.map((color, i) => (
              <li key={i} data-reveal>
                <div
                  aria-hidden="true"
                  data-empty={!(color.hex || color.palette) || undefined}
                  className={styles.swatchColor}
                  style={swatchFill(color)}
                />
                <p className={styles.swatchMeta}>
                  <span className={styles.swatchName}>{copy(color.name)}</span>
                  {color.hex && <span className={styles.label}>{color.hex}</span>}
                </p>
                {color.palette && <p className={styles.label}>{color.palette.join(" · ")}</p>}
                {color.token && <p className={styles.swatchToken}>{color.token}</p>}
                {color.rationale && <p className={styles.itemText}>{copy(color.rationale)}</p>}
              </li>
            ))}
          </ul>
        </Row>
      )}

      {data.specs?.length > 0 && (
        <Row className={styles.block}>
          <h3 className={`${styles.label} mb-4`}>Foundations</h3>
          <dl className={styles.specs}>
            {data.specs.map((spec) => (
              <div key={spec.name} data-reveal className={styles.spec}>
                <dt className={styles.label}>{spec.name}</dt>
                <dd>
                  {spec.value && <p className={styles.specValue}>{copy(spec.value)}</p>}
                  {spec.rationale && <p className={styles.specWhy}>{copy(spec.rationale)}</p>}
                </dd>
              </div>
            ))}
          </dl>
        </Row>
      )}
    </>
  );
}
