import Link from "next/link";
import { visualSize } from "@/data/projects";
import CaseImage from "./CaseImage";
import styles from "./CaseStudy.module.css";

// A hand-off to the next case study, in that project's own colours — the
// same palette it has in Selected Work. Sized to one viewport: on desktop the
// title and summary sit beside the visual; below that they stack, with the
// visual kept short enough that the whole block stays on screen.
export default function NextProject({ project }) {
  const lead = project.visuals[0];
  const preview = { ...lead, ...visualSize, label: `${project.title} · ${lead.label}` };

  return (
    <section
      data-case-next
      aria-labelledby="next-project-title"
      className={styles.next}
      style={{ "--n-bg": project.background, "--n-fg": project.foreground, "--n-gradient": project.gradient }}
    >
      <div className={styles.container}>
        <Link
          href={project.href}
          aria-label={`Next project: ${project.title}. ${project.cta ?? "View case study"}`}
          className={styles.nextLink}
        >
          <div className={styles.nextText}>
            <p className={styles.label}>Next project</p>
            <p className={`${styles.label} ${styles.nextMeta}`}>
              {project.number} — {project.subtitle}
            </p>
            <h2 id="next-project-title" className={styles.nextTitle}>
              {project.title}
            </h2>
            {project.description && <p className={styles.nextSummary}>{project.description}</p>}
            <span className={`${styles.label} ${styles.nextCta}`}>
              {project.cta ?? "View case study"} <span aria-hidden="true">→</span>
            </span>
          </div>
          <div className={styles.nextVisual}>
            <CaseImage image={preview} sizes="(min-width: 1024px) 58vw, 94vw" />
          </div>
        </Link>
      </div>
    </section>
  );
}
