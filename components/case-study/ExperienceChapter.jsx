import CaseMedia from "./CaseMedia";
import { Row } from "./CaseSection";
import { copy, pad, paragraphs } from "./CaseText";
import styles from "./CaseStudy.module.css";

// One chapter of the final experience, organised around a user goal: the
// goal, the screens that serve it, and short numbered notes on what matters.
// Optional `body` explains the thinking; optional `tags` name states/variants.
// `media` can be one block or a list of blocks shown one after another.
// `layout: "split"` keeps the text beside the visual while it scrolls past —
// keep split text short (no body/tags) so the visuals stay the taller column.
export default function ExperienceChapter({ chapter, number }) {
  const id = `chapter-${number}`;
  const media = [].concat(chapter.media ?? []).map((block, i) => (
    <div key={i} className={i > 0 ? "mt-6" : undefined}>
      <CaseMedia media={block} />
    </div>
  ));

  const heading = (
    <h3 id={id} className={styles.label}>
      {number} — {copy(chapter.title)}
    </h3>
  );
  const goal = (
    <>
      <p className={styles.chapterGoal}>{copy(chapter.goal)}</p>
      {paragraphs(chapter.body).map((text, i) => (
        <p key={i} className={`${styles.body} mt-4`}>
          {copy(text)}
        </p>
      ))}
      {chapter.tags?.length > 0 && (
        <ul aria-label={chapter.tagsLabel} className={styles.chips}>
          {chapter.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </>
  );
  const notes = chapter.annotations?.length > 0 && (
    <ol aria-label={`What matters in ${chapter.title}`} className={styles.annotations}>
      {chapter.annotations.map((note, i) => (
        <li key={note}>
          <span className={styles.label}>{pad(i + 1)}</span>
          {copy(note)}
        </li>
      ))}
    </ol>
  );

  if (chapter.layout === "split") {
    return (
      <article aria-labelledby={id} className={styles.chapter}>
        <div className={`${styles.grid} ${styles.split}`}>
          <div data-reveal className={`${styles.splitText} ${styles.chapterHead}`}>
            {heading}
            <div className="mt-4">{goal}</div>
            {notes}
          </div>
          <div className={styles.splitMedia}>{media}</div>
        </div>
      </article>
    );
  }

  return (
    <article aria-labelledby={id} className={styles.chapter}>
      <div className={`${styles.grid} ${styles.chapterHead}`}>
        <div data-reveal className={styles.side}>
          {heading}
        </div>
        <div data-reveal className={styles.main}>
          {goal}
        </div>
      </div>
      {media}
      {notes && <Row>{notes}</Row>}
    </article>
  );
}
