import CaseImage from "./CaseImage";
import { Row } from "./CaseSection";
import { Lines, paragraphs } from "./CaseText";
import styles from "./CaseStudy.module.css";

// How a decision was reached, under a Design Decision that has an
// `exploration`: options explored → what I chose → why → result, plus 2–3
// images (wireframes, rejected options). "What I chose" and "Why" come from
// the decision itself; the rest from `exploration`
// ({ options, result?, images: [image()] }). Missing parts are left out.

// The first sentence of a copy field, for a one-line summary.
function firstSentence(value) {
  const [first] = paragraphs(value).flat();
  if (typeof first !== "string") return null;
  const match = first.match(/^.+?[.!?](?=\s|$)/);
  return match ? match[0] : first;
}

export default function Exploration({ decision }) {
  const { options, result, images = [] } = decision.exploration;
  const steps = [
    ["Options explored", options],
    ["What I chose", decision.title],
    ["Why", firstSentence(decision.why)],
    ["Result", result],
  ].filter(([, text]) => text);

  return (
    <Row span="wide" className={styles.block}>
      <div data-reveal className={styles.exploration}>
        <p className={styles.label}>Exploration</p>
        <ol className={styles.explorationSteps}>
          {steps.map(([label, text]) => (
            <li key={label}>
              <span className={styles.label}>{label}</span>
              <div className={styles.explorationText}>
                <Lines text={text} />
              </div>
            </li>
          ))}
        </ol>
        {images.length > 0 && (
          <div className={styles.explorationShots}>
            {images.map((image) => (
              <CaseImage key={image.src} image={image} compact sizes="(min-width: 1024px) 28vw, 46vw" />
            ))}
          </div>
        )}
      </div>
    </Row>
  );
}
