import CaseImage from "./CaseImage";
import { Row } from "./CaseSection";
import { copy, Lines, pad } from "./CaseText";
import styles from "./CaseStudy.module.css";

const SIZES = {
  full: "(min-width: 1440px) 1360px, 94vw",
  half: "(min-width: 1024px) 46vw, 94vw",
  pairLead: "(min-width: 1024px) 54vw, 94vw",
  pairSide: "(min-width: 1024px) 38vw, 94vw",
  split: "(min-width: 1024px) 60vw, 94vw",
};

const PROPOSED_NOTE = "Recommended during design reviews — not confirmed as shipped.";

// One problem-solving chapter: the problem, my solution, then the screens.
// Each layout composes the screens differently so chapters don't repeat:
//   feature  one large screen with numbered notes, then two smaller
//            supporting screens (offset) and a line of UX principles
//   pair     two screens shown together — a larger lead and an offset side
//            screen — with the notes underneath
//   split    the text stays in view while stacked screens scroll past, with
//            an optional smaller inset screen
// A note is a string or { text, proposed: true }; proposed notes are tagged
// so finished designs and recommendations stay distinct.
export default function SolutionChapter({ data: chapter }) {
  const Layout = { feature: Feature, pair: Pair, split: Split }[chapter.layout ?? "feature"];
  const notes = [chapter.main, ...(chapter.supporting ?? []), ...(chapter.images ?? []), chapter]
    .flatMap((item) => item?.notes ?? []);
  const hasProposed = notes.some((note) => typeof note === "object" && note.proposed);

  return (
    <>
      <Layout chapter={chapter} />
      {hasProposed && (
        <Row className={styles.chapterLegend}>
          <p data-reveal className={styles.proposedLegend}>
            <span className={styles.proposedTag}>Proposed</span>
            {PROPOSED_NOTE}
          </p>
        </Row>
      )}
    </>
  );
}

function Feature({ chapter }) {
  const { main, supporting = [] } = chapter;
  return (
    <>
      <Row className={styles.headBody}>
        <Brief chapter={chapter} />
      </Row>

      {main && (
        <figure className={`${styles.grid} ${styles.figure}`}>
          <div className={styles.full}>
            <CaseImage image={main} sizes={SIZES.full} reveal data-parallax />
            {main.caption && <figcaption className={styles.caption}>{copy(main.caption)}</figcaption>}
          </div>
          {main.notes?.length > 0 && (
            <div className={styles.wide}>
              <Notes items={main.notes} label={`What changed in ${main.title ?? "this screen"}`} wide />
            </div>
          )}
        </figure>
      )}

      {supporting.length > 0 && (
        <div className={`${styles.grid} ${styles.supporting}`}>
          {supporting.map((image, i) => (
            <figure key={image.src} className={styles.supportItem} data-offset={i % 2 === 1 || undefined}>
              <CaseImage image={image} sizes={SIZES.half} reveal />
              <ScreenCaption image={image} />
              <Notes items={image.notes} label={`What changed in ${image.title}`} />
            </figure>
          ))}
        </div>
      )}

      {chapter.principles?.length > 0 && (
        <Row span="wide" className={styles.block}>
          <h4 data-reveal className={styles.label}>
            {chapter.principlesLabel ?? "Key UX principles"}
          </h4>
          <ul data-reveal className={styles.principleLine}>
            {chapter.principles.map((principle) => (
              <li key={principle}>{copy(principle)}</li>
            ))}
          </ul>
        </Row>
      )}
    </>
  );
}

function Pair({ chapter }) {
  const [lead, side] = chapter.images ?? [];
  return (
    <>
      <Row className={styles.headBody}>
        <Brief chapter={chapter} />
      </Row>

      <div className={`${styles.grid} ${styles.pair}`}>
        {lead && (
          <figure className={styles.pairLead}>
            <CaseImage image={lead} sizes={SIZES.pairLead} reveal data-parallax />
            <ScreenCaption image={lead} />
          </figure>
        )}
        {side && (
          <figure className={styles.pairSide}>
            <CaseImage image={side} sizes={SIZES.pairSide} reveal />
            <ScreenCaption image={side} />
          </figure>
        )}
      </div>

      {chapter.notes?.length > 0 && (
        <Row span="wide" className={styles.block}>
          {chapter.notesLabel && (
            <h4 data-reveal className={styles.label}>
              {chapter.notesLabel}
            </h4>
          )}
          <Notes items={chapter.notes} label={chapter.notesLabel ?? chapter.title} wide />
        </Row>
      )}
    </>
  );
}

function Split({ chapter }) {
  const { images = [], inset } = chapter;
  return (
    <div className={`${styles.grid} ${styles.split} ${styles.headBody}`}>
      <div className={styles.splitText}>
        <Brief chapter={chapter} stacked />
        {chapter.notes?.length > 0 && (
          <Notes items={chapter.notes} label={chapter.notesLabel ?? chapter.title} />
        )}
      </div>

      <div className={`${styles.splitMedia} ${styles.splitStack}`}>
        {images.map((image) => (
          <figure key={image.src}>
            <CaseImage image={image} sizes={SIZES.split} reveal data-parallax />
            <ScreenCaption image={image} />
          </figure>
        ))}
        {inset && (
          <figure className={styles.inset}>
            <CaseImage image={inset} sizes={SIZES.half} reveal />
            <ScreenCaption image={inset} />
          </figure>
        )}
      </div>
    </div>
  );
}

// Problem and solution side by side (stacked in the split layout), then an
// optional line on what it changes for users.
function Brief({ chapter, stacked }) {
  const items = [
    ["Problem", chapter.problem],
    ["My solution", chapter.solution],
  ].filter(([, text]) => text);

  return (
    <>
      <dl className={styles.brief} data-stacked={stacked || undefined}>
        {items.map(([label, text]) => (
          <div key={label} data-reveal>
            <dt className={styles.label}>{label}</dt>
            <dd>
              <Lines text={text} />
            </dd>
          </div>
        ))}
      </dl>
      {chapter.why && (
        <div data-reveal className={styles.briefWhy}>
          <Lines text={chapter.why} />
        </div>
      )}
    </>
  );
}

function ScreenCaption({ image }) {
  if (!image.title && !image.caption) return null;
  return (
    <figcaption className={styles.screenCaption}>
      {image.title && <span className={styles.label}>{copy(image.title)}</span>}
      {image.caption && <span>{copy(image.caption)}</span>}
    </figcaption>
  );
}

function Notes({ items, label, wide }) {
  if (!items?.length) return null;
  return (
    <ol aria-label={label} className={styles.notes} data-wide={wide || undefined}>
      {items.map((note, i) => {
        const { text, proposed } = typeof note === "string" ? { text: note } : note;
        return (
          <li key={i} data-reveal>
            <span className={styles.noteNumber}>{pad(i + 1)}</span>
            <span>
              {copy(text)}
              {proposed && <span className={styles.proposedTag}>Proposed</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
