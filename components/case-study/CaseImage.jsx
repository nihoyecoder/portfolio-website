import { publicFileExists } from "@/lib/assets";
import LoadingImage from "./LoadingImage";
import styles from "./CaseStudy.module.css";

// One image slot. Shows the image once the file exists in /public; until then
// a placeholder with the same proportions, what it's for and its export size.
// While the image loads, its frame shows a skeleton (see LoadingImage).
// `compact` (small mobile screens) leaves out the file path; `ratio` crops
// the frame to another shape (the image is cover-fitted).
export default function CaseImage({ image, sizes = "100vw", preload, tone, reveal, compact, ratio, ...props }) {
  const exists = Boolean(image.src) && publicFileExists(image.src);

  return (
    <div
      data-reveal={reveal ? "media" : undefined}
      data-tone={tone}
      className={styles.frame}
      style={{ aspectRatio: ratio ?? `${image.width} / ${image.height}` }}
      {...props}
    >
      {exists ? (
        <LoadingImage src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} quality={image.quality} />
      ) : (
        <div aria-hidden="true" className={styles.placeholder}>
          <span>{image.label || "Image"}</span>
          <span className={styles.placeholderFoot}>
            {!compact && <span>{image.src}</span>}
            <span>
              {image.width} × {image.height}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
