import CaseImage from "./CaseImage";
import { Row } from "./CaseSection";
import { copy, InlineList, Lines, pad } from "./CaseText";
import styles from "./CaseStudy.module.css";

const SIZES = {
  aside: "(min-width: 1280px) 62vw, (min-width: 1024px) 56vw, 94vw",
  single: "(min-width: 1024px) 62vw, 94vw",
  half: "(min-width: 768px) 46vw, 94vw",
  lead: "(min-width: 1024px) 62vw, 94vw",
  beside: "(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 94vw",
};

// A short project showcase on a multi-project page ("Other Works"): what the
// project is, my role and who I worked with, then a few stories — each a
// problem, the design approach and its UX value, told through real screens.
// Not a full case study. Story layouts:
//   aside    text beside the screens (sticky on desktop); `flip` swaps sides
//   stacked  label in the side column and text in the reading column (like a
//            section head), then the screens on the same grid: one starts at
//            the reading column, two sit side by side, three become a large
//            lead with two beside it
export default function ProjectShowcase({ data }) {
  return (
    <>
      <Intro data={data} />
      {data.stories.map((story, i) => (
        <Story key={i} story={story} number={pad(i + 1)} />
      ))}
    </>
  );
}

function Intro({ data }) {
  const facts = [
    ["Category", data.category],
    ["My role", data.role],
    ["Team", data.team],
    ["Contribution", data.contribution],
  ].filter(([, value]) => value);

  return (
    <Row className={styles.headBody}>
      <div data-reveal className={styles.body}>
        <Lines text={data.description} />
      </div>
      {/* Label / value rows, so long values wrap cleanly at any width */}
      {facts.length > 0 && (
        <dl data-reveal className={styles.facts}>
          {facts.map(([label, value]) => (
            <div key={label} className={styles.fact}>
              <dt className={styles.label}>{label}</dt>
              <dd>{Array.isArray(value) ? <InlineList items={value} /> : copy(value)}</dd>
            </div>
          ))}
        </dl>
      )}
      {data.note && (
        <p data-reveal className={styles.showcaseNote}>
          {copy(data.note)}
        </p>
      )}
    </Row>
  );
}

function Story({ story, number }) {
  const eyebrow = (
    <>
      <span className={styles.storyNumber}>{number}</span>
      {story.label && ` — ${story.label}`}
    </>
  );

  const text = (
    <>
      <h3 className={styles.storyTitle}>{copy(story.title)}</h3>
      {story.problem && <p className={styles.storyProblem}>{copy(story.problem)}</p>}
      {story.approach?.length > 0 && (
        <ul className={styles.storyList}>
          {story.approach.map((point) => (
            <li key={point}>{copy(point)}</li>
          ))}
        </ul>
      )}
      {story.value && (
        <div className={`${styles.briefWhy} ${styles.storyValue}`}>
          <span className={`${styles.label} block`}>UX value</span>
          <Lines text={story.value} />
        </div>
      )}
    </>
  );

  if (story.layout === "aside") {
    return (
      <article className={`${styles.grid} ${styles.story}`} data-layout="aside" data-flip={story.flip || undefined}>
        <div data-reveal className={styles.storyAside}>
          <p className={styles.label}>{eyebrow}</p>
          {text}
        </div>
        <div className={styles.storyMedia}>
          {story.images.map((image) => (
            <Shot key={image.src} image={image} sizes={SIZES.aside} />
          ))}
        </div>
      </article>
    );
  }

  const count = story.images.length;
  const roles =
    count === 1 ? ["single"] : count === 2 ? ["half", "half"] : ["lead", ...story.images.slice(1).map(() => "beside")];

  return (
    <article className={styles.story}>
      <div className={`${styles.grid} ${styles.storyHead}`}>
        <p data-reveal className={`${styles.label} ${styles.side}`}>
          {eyebrow}
        </p>
        <div data-reveal className={styles.main}>
          {text}
        </div>
      </div>
      <div className={styles.storyShots}>
        {story.images.map((image, i) => (
          <div key={image.src} data-role={roles[i]} className={styles.storyShot}>
            <Shot image={image} sizes={SIZES[roles[i]]} />
          </div>
        ))}
      </div>
    </article>
  );
}

function Shot({ image, sizes }) {
  return (
    <figure>
      <CaseImage image={image} sizes={sizes} reveal />
      {image.caption && <figcaption className={styles.caption}>{copy(image.caption)}</figcaption>}
    </figure>
  );
}
