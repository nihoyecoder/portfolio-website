import Image from "next/image";
import Link from "next/link";
import { visualSize } from "@/data/projects";
import styles from "./Work.module.css";

// One 16:10 frame. Shows the image when the file exists, otherwise a quiet
// placeholder in the project's own colours with the expected dimensions.
// With `href` (the lead visual) the frame is a link to the case study.
export default function ProjectVisual({ visual, role, number, exists, sizes, href, label }) {
  const content = exists ? (
    <Image src={visual.src} alt={visual.alt} fill sizes={sizes} className="object-cover" />
  ) : (
    <div aria-hidden="true" className={styles.placeholder}>
      <span>
        {number} · {visual.label}
      </span>
      <span>
        {visualSize.width} × {visualSize.height}
      </span>
    </div>
  );

  return href ? (
    <Link href={href} prefetch={false} aria-label={label} data-role={role} className={styles.frame}>
      {content}
    </Link>
  ) : (
    <div data-role={role} className={styles.frame}>
      {content}
    </div>
  );
}
