import CaseMedia from "./CaseMedia";
import { Row } from "./CaseSection";
import { copy, InlineList, pad, paragraphs } from "./CaseText";
import VisualLanguage from "./VisualLanguage";
import styles from "./CaseStudy.module.css";

const DETAIL = "mt-2 block max-w-[58ch] text-[16px] font-normal leading-[1.55] tracking-normal text-muted";

// What the system supports, what it covers, then the components themselves.
// Optional `principle` closes the intro; optional `visualLanguage` (see
// VisualLanguage) folds the look-and-feel rationale into this section.
// A platform is a name, or { name, detail } where detail is a sentence or a
// list of the patterns it uses.
export default function DesignSystemShowcase({ data }) {
  return (
    <>
      <Row className={styles.headBody}>
        {data.statement && (
          <p data-reveal className={styles.lead}>
            {copy(data.statement)}
          </p>
        )}
        {paragraphs(data.body).map((text, i) => (
          <p key={i} data-reveal className={styles.body}>
            {copy(text)}
          </p>
        ))}
        {data.platforms?.length > 0 && (
          <div className={data.body ? "pt-6" : undefined}>
            <ol className={styles.platforms}>
              {data.platforms.map((platform, i) => {
                const { name, detail } = typeof platform === "string" ? { name: platform } : platform;
                return (
                  <li key={name} data-reveal>
                    <span className={styles.label}>{pad(i + 1)}</span>
                    <span>
                      {copy(name)}
                      {Array.isArray(detail) ? (
                        <InlineList items={detail} className={DETAIL} />
                      ) : (
                        detail && <span className={DETAIL}>{copy(detail)}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
        {data.principle && (
          <div data-reveal className="pt-6">
            <p className={styles.label}>Principle</p>
            <p className={styles.principle}>{copy(data.principle)}</p>
          </div>
        )}
        {data.covers?.length > 0 && (
          <ul aria-label="What the system covers" className={styles.chips}>
            {data.covers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Row>

      {data.visualLanguage && <VisualLanguage data={data.visualLanguage} />}

      {data.media?.map((media, i) => (
        <CaseMedia key={i} media={media} />
      ))}

      {data.note && (
        <Row className={styles.block}>
          <p data-reveal className={styles.body}>
            {copy(data.note)}
          </p>
        </Row>
      )}
    </>
  );
}
