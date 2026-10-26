import Link from "next/link";
import { projects } from "@/data/projects";
import ArrowIcon from "@/components/ui/ArrowIcon";
import { publicFileExists } from "@/lib/assets";
import ProjectVisual from "./ProjectVisual";
import WorkMotion from "./WorkMotion";
import styles from "./Work.module.css";

const meta = "font-mono text-[11px] uppercase tracking-[0.08em]";

// Lead visual first, then the two supporting views.
const ROLES = ["lead", "a", "b"];
const SIZES = {
  lead: "(min-width: 1024px) 46vw, (min-width: 768px) 54vw, 80vw",
  support: "(min-width: 1024px) 23vw, (min-width: 768px) 27vw, 40vw",
};

export default function Work() {
  const palette = projects.map(({ background, foreground, accent }) => ({
    background,
    foreground,
    accent,
  }));

  return (
    <WorkMotion id="work" aria-labelledby="work-heading" palette={palette} className={styles.root}>
      <div data-work-stage className={styles.stage}>
        {/* A project's gradient fades in over its solid colour while it's shown */}
        {projects.map(
          (project, index) =>
            project.gradient && (
              <div
                key={project.id}
                aria-hidden="true"
                data-work-glow={index}
                className={styles.glow}
                style={{ backgroundImage: project.gradient }}
              />
            ),
        )}
        <div className={`${styles.topbar} ${meta}`}>
          <h2 id="work-heading">Selected work</h2>
          <p aria-hidden="true">({String(projects.length).padStart(2, "0")})</p>
        </div>

        {projects.map((project, index) => (
          <Project key={project.id} project={project} index={index} />
        ))}

        <div aria-hidden="true" className={styles.scrim} />

        <nav aria-label="Projects" className={styles.indicator}>
          <ol className={styles.indicatorList}>
            {projects.map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  data-work-goto={index}
                  aria-label={`Show ${project.title}`}
                  className={`${styles.indicatorButton} ${meta}`}
                >
                  <span className={styles.indicatorLabel}>{project.title}</span>
                  <span data-work-pill aria-hidden="true" className={styles.pill}>
                    <span className={styles.pillFill} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </WorkMotion>
  );
}

function Project({ project, index }) {
  const colors = {
    "--p-bg": project.background,
    "--p-gradient": project.gradient,
    "--p-fg": project.foreground,
    "--p-accent": project.accent,
  };

  return (
    <article
      data-project
      aria-labelledby={`project-${project.id}`}
      className={styles.project}
      style={colors}
    >
      <div className={styles.text}>
        <span className="block overflow-hidden">
          <span data-work-line="meta" className={`block opacity-70 ${meta}`}>
            {project.number} — {project.tag ?? project.subtitle}
          </span>
        </span>

        <h3
          id={`project-${project.id}`}
          style={project.titleScale ? { "--title-scale": project.titleScale } : undefined}
          className={`${styles.title} mt-3 font-semibold leading-[0.86] tracking-[-0.055em] text-[calc(16vw*var(--title-scale,1))] md:mt-4 md:text-[calc(min(9vw,15svh)*var(--title-scale,1))]`}
        >
          <span className="sr-only">{project.title}</span>
          {/* One masked line per word (or per `titleLines` entry), so a long
              title stacks instead of running into the visuals */}
          {(project.titleLines ?? project.title.split(" ")).map((line) => (
            <span
              key={line}
              aria-hidden="true"
              className="-mx-[0.04em] -mb-[0.12em] block overflow-hidden whitespace-nowrap px-[0.04em] pt-[0.06em] pb-[0.16em]"
            >
              {[...line].map((char, i) => (
                <span key={i} data-work-char className="inline-block">
                  {char === " " ? " " : char}
                </span>
              ))}
            </span>
          ))}
        </h3>

        <div className="mt-4 overflow-hidden md:mt-6">
          <div data-work-desc>
            <p className="max-w-[34ch] text-[15px] leading-snug opacity-80 md:text-base">{project.description}</p>
            {/* Status (Live / Pilot / Concept) and one real outcome, once set. */}
            {(project.status || project.outcome) && (
              <p className={`mt-3 flex max-w-[44ch] flex-wrap items-center gap-x-3 gap-y-1.5 ${meta}`}>
                {project.status && (
                  <span className="rounded-[3px] border border-current/50 px-2.5 py-1 leading-none">
                    {project.status}
                  </span>
                )}
                {project.outcome && <span className="normal-case tracking-normal opacity-90">{project.outcome}</span>}
              </p>
            )}
          </div>
        </div>

        {/* Padding gives the focus ring room inside the clipping mask. The
            lead visual is a link to the case study too. */}
        <div className="-m-1.5 mt-5 overflow-hidden p-1.5 md:mt-7">
          <Link
            data-work-line="cta"
            href={project.href}
            prefetch={false}
            className={`group inline-flex items-center gap-2 rounded-[3px] border border-current/45 px-4 py-2.5 ${meta} transition-colors duration-300 hover:border-current hover:bg-current/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`}
          >
            {project.cta}
            <span className="sr-only">: {project.title}</span>
            <span
              aria-hidden="true"
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            >
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>

      <div data-work-panel className={styles.panel} style={{ "--i": index }}>
        <div className={styles.deck}>
          {project.visuals.slice(0, ROLES.length).map((visual, i) => (
            <ProjectVisual
              key={visual.src}
              visual={visual}
              role={ROLES[i]}
              number={project.number}
              exists={publicFileExists(visual.src)}
              sizes={i === 0 ? SIZES.lead : SIZES.support}
              href={i === 0 ? project.href : undefined}
              label={`${project.title} case study`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
