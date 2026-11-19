import { Fragment } from "react";
import { publicFileExists } from "@/lib/assets";
import { FULL_SIZES } from "@/lib/case-study";
import BeforeAfter from "./BeforeAfter";
import CaseImage from "./CaseImage";
import { copy, pad } from "./CaseText";
import Lightbox from "./Lightbox";
import styles from "./CaseStudy.module.css";

const SIZES = {
  full: FULL_SIZES,
  // An annotated screenshot: full width, or 64rem wide and panning on phones.
  pan: "(min-width: 1280px) calc(100vw - 80px), (min-width: 768px) calc(100vw - 64px), 1024px",
  wide: "(min-width: 1024px) 62vw, 94vw",
  2: "(min-width: 768px) 46vw, 94vw",
  3: "(min-width: 768px) 30vw, 94vw",
  screen: "(min-width: 768px) 18vw, 62vw",
  flow: "(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 94vw",
  overlay: "(min-width: 1024px) 30vw, 72vw",
};

// Renders one media block from the case-study data in its layout:
//   full / wide       one large visual (whole width, or beside the label column)
//   two-up / three-up panels side by side
//   phones            mobile screens on the project's tinted canvas
//   sequence          mobile screens as numbered steps of a flow
//                     (`arrows: true` draws an arrow between screens)
//                     Both take `markers` on a screen and `notes` below the
//                     row, as in annotated.
//   before-after      two labelled states
//   annotated         one screenshot with numbered highlight boxes and notes;
//                     optional overlapping `overlay` screen and zoomed `details`
//   split             two screens side by side, joined by a sign (default "+")
//   flow              wide screens as numbered steps with arrows between
export default function CaseMedia({ media }) {
  const { layout, caption } = media;

  if (layout === "full" || layout === "wide") {
    return (
      <Figure span={layout} caption={caption}>
        <CaseImage image={media.image} sizes={SIZES[layout]} reveal />
      </Figure>
    );
  }

  if (layout === "two-up" || layout === "three-up") {
    const count = layout === "two-up" ? 2 : 3;
    return (
      <Figure caption={caption}>
        <div className={styles.columns} data-count={count}>
          {media.images.map((image) => (
            <div key={image.src}>
              <CaseImage image={image} sizes={SIZES[count]} reveal />
              {image.caption && <p className={styles.caption}>{copy(image.caption)}</p>}
            </div>
          ))}
        </div>
      </Figure>
    );
  }

  // The caption sits right under the visual as its one-line takeaway; the
  // numbered notes (and any zoomed details) follow the figure.
  if (layout === "phones" || layout === "sequence") {
    return (
      <>
        <Figure caption={caption}>
          <Screens images={media.images} sequence={layout === "sequence"} arrows={media.arrows} />
        </Figure>
        <Notes notes={media.notes} />
      </>
    );
  }

  if (layout === "annotated") {
    return (
      <>
        <Figure caption={caption}>
          <Annotated media={media} />
        </Figure>
        <Notes notes={media.notes} />
        <Details details={media.details} />
      </>
    );
  }

  if (layout === "split") {
    return (
      <Figure caption={caption}>
        <div className={styles.splitPair}>
          {media.images.map((image, i) => (
            <Fragment key={image.src}>
              {i > 0 && (
                <span aria-hidden="true" className={styles.splitJoin}>
                  {media.join ?? "+"}
                </span>
              )}
              <div className={styles.splitItem}>
                {image.title && <p className={`${styles.label} ${styles.splitEyebrow}`}>{copy(image.title)}</p>}
                <CaseImage image={image} sizes={SIZES[2]} reveal />
                {image.caption && <p className={styles.caption}>{copy(image.caption)}</p>}
              </div>
            </Fragment>
          ))}
        </div>
      </Figure>
    );
  }

  if (layout === "flow") {
    return (
      <Figure caption={caption}>
        <ol className={styles.flow} data-count={media.images.length}>
          {media.images.map((image, i) => (
            <li key={image.src} className={styles.flowStep}>
              <div className={styles.flowShot}>
                <CaseImage image={image} sizes={SIZES.flow} reveal compact />
              </div>
              <p className={styles.flowLabel}>
                <span className={styles.label}>{pad(i + 1)}</span>
                {copy(image.title)}
              </p>
            </li>
          ))}
        </ol>
      </Figure>
    );
  }

  if (layout === "before-after") {
    return (
      <Figure caption={caption}>
        <BeforeAfter before={media.before} after={media.after} />
      </Figure>
    );
  }

  return null;
}

function Figure({ span = "full", caption, children }) {
  return (
    <div className={`${styles.grid} ${styles.figure}`}>
      <figure className={styles[span]}>
        {children}
        {caption && <figcaption className={styles.caption}>{copy(caption)}</figcaption>}
      </figure>
    </div>
  );
}

// On phones the row scrolls sideways instead of shrinking the screens.
function Screens({ images, sequence, arrows }) {
  const arrowed = sequence && arrows;
  return (
    <>
      <div data-reveal="media" className={styles.stage}>
        <ol
          className={`${styles.screens} ${sequence ? styles.sequence : ""} ${arrowed ? styles.arrowed : ""}`}
          data-count={images.length}
        >
          {images.map((image, i) => (
            <li key={image.src} className={styles.screen}>
              <div className={styles.shot}>
                <CaseImage image={image} sizes={SIZES.screen} compact />
                <Markers image={image} markers={image.markers} />
                {arrowed && i < images.length - 1 && <SequenceArrow />}
              </div>
              {sequence && (
                <p className={styles.step}>
                  <span className={styles.label}>Step {pad(i + 1)}</span>
                  {image.title && <span className="block font-medium">{copy(image.title)}</span>}
                  {copy(image.caption)}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
      {images.length > 1 && (
        <p aria-hidden="true" className={`${styles.label} ${styles.scrollHint}`}>
          Swipe to see all screens →
        </p>
      )}
    </>
  );
}

// Highlight boxes over one image, given in the image's own pixels
// ([x1, y1, x2, y2]) so they stay on target at any width. `n` ties a box to
// a note. The parent must be the image's positioned box.
function Markers({ image, markers = [] }) {
  const pct = (value, total) => `${((value / total) * 100).toFixed(3)}%`;
  return markers.map(({ n, box: [x1, y1, x2, y2] }, i) => (
    <span
      key={i}
      data-marker
      aria-hidden="true"
      className={styles.marker}
      style={{
        left: pct(x1, image.width),
        top: pct(y1, image.height),
        width: pct(x2 - x1, image.width),
        height: pct(y2 - y1, image.height),
      }}
    >
      <span className={styles.markerNumber}>{pad(n)}</span>
    </span>
  ));
}

// What the markers point to, numbered in order: short callouts on the page
// grid, under the figure.
function Notes({ notes = [] }) {
  if (notes.length === 0) return null;
  return (
    <div className={styles.grid}>
      <ol className={`${styles.full} ${styles.markerNotes}`}>
        {notes.map((note, i) => (
          <li key={i} data-reveal>
            <span className={styles.noteNumber}>{pad(i + 1)}</span>
            <span>{copy(note)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Zoomed crops under an annotated screenshot, so small UI stays readable.
function Details({ details = [] }) {
  if (details.length === 0) return null;
  return (
    <div className={styles.grid}>
      <div className={`${styles.full} ${styles.details}`}>
        {details.map((detail) => (
          <div key={detail.src} className={styles.detail} data-wide={detail.wide || undefined}>
            <CaseImage image={detail} sizes={detail.wide ? SIZES.full : SIZES[2]} reveal />
            {detail.caption && <p className={styles.caption}>{copy(detail.caption)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Sits in the gap after a screen, level with its middle.
function SequenceArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 12" className={styles.arrow}>
      <path d="M0 6h37M32 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

// One screenshot with highlight boxes (see Markers); the overlay can carry a
// note number too. Its notes and details follow the figure (CaseMedia).
function Annotated({ media }) {
  const { image, markers = [], overlay } = media;

  return (
    <>
      {/* markerTone: "light" for screenshots on a dark background */}
      <div className={styles.annotated} data-overlay={overlay ? "" : undefined} data-tone={media.markerTone}>
        {/* Phones: the screenshot keeps a readable width and pans sideways,
            opening on `panFocus` (0–1 of its width) when it's set */}
        <div className={styles.pan} data-pan-focus={media.panFocus}>
          <div className={styles.annotatedShot}>
            <CaseImage image={image} sizes={SIZES.pan} reveal />
            <Markers image={image} markers={markers} />
          </div>
        </div>
        {publicFileExists(image.src) && <Lightbox image={image} />}
        {overlay && (
          <div className={styles.overlay}>
            <CaseImage image={overlay} sizes={SIZES.overlay} reveal />
            {overlay.marker && (
              <span data-marker aria-hidden="true" className={styles.overlayNumber}>
                {pad(overlay.marker)}
              </span>
            )}
          </div>
        )}
      </div>
      <p aria-hidden="true" className={`${styles.label} ${styles.scrollHint}`}>
        Swipe to explore →
      </p>
    </>
  );
}
