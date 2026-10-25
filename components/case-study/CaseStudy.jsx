import { contactLink } from "@/lib/site";
import CaseHero from "./CaseHero";
import CaseMedia from "./CaseMedia";
import CaseNav from "./CaseNav";
import CaseSection, { Row } from "./CaseSection";
import CaseStudyMotion from "./CaseStudyMotion";
import { copy, pad, paragraphs } from "./CaseText";
import DesignDecision from "./DesignDecision";
import DesignSystemShowcase from "./DesignSystemShowcase";
import ExperienceChapter from "./ExperienceChapter";
import ItemGrid from "./ItemGrid";
import NextProject from "./NextProject";
import OutcomeBlock from "./OutcomeBlock";
import ProjectShowcase from "./ProjectShowcase";
import SolutionChapter from "./SolutionChapter";
import VisualLanguage from "./VisualLanguage";
import styles from "./CaseStudy.module.css";

// The story, in order. A section renders only when the project's data has
// it, so every case study uses this one layout with its own content.
// Headings and labels can be overridden per project with
// `headings: { [key]: "…" }` and `labels: { [key]: "…" }`.
const SECTIONS = [
  { key: "challenge", id: "challenge", group: "problem", label: "Challenge", title: (d) => d.statement ?? "The challenge", Content: Challenge },
  { key: "research", id: "research", group: "problem", label: "Research", title: "What the research showed", Content: Research },
  { key: "users", id: "users", group: "problem", label: "Users", title: "Who I was designing for", Content: Users },
  { key: "constraints", id: "constraints", group: "problem", label: "Constraints", title: "The reality I had to design around", Content: Constraints },
  { key: "approach", id: "approach", group: "strategy", label: "Approach", title: "My approach", Content: Approach },
  { key: "decisions", id: "decisions", group: "decisions", label: "Design decisions", title: "Decisions that shaped the experience", Content: Decisions },
  // Expands into one section (and one nav item) per chapter — see SolutionChapter.
  { key: "chapters", group: "chapters" },
  { key: "experience", id: "experience", group: "solution", label: "Final experience", title: "The final experience", Content: Experience },
  { key: "operations", id: "operations", group: "solution", label: "Provider operations", title: "Behind the experience", Content: Operations },
  { key: "beforeAfter", id: "before-after", group: "solution", label: "Before / after", title: (d) => d.title ?? "What changed", Content: BeforeAfterSection },
  { key: "visualLanguage", id: "visual-language", group: "system", label: "Visual language", title: "Designing the visual language", Content: VisualLanguage },
  { key: "designSystem", id: "design-system", group: "system", label: "Design system", title: "Turning the experience into a system", Content: DesignSystemShowcase },
  { key: "showcase", id: "showcase", group: "showcase", label: "Final product", title: "The finished experience", Content: Showcase },
  { key: "website", id: "website", group: "website", label: "Website", title: "The website", Content: Website },
  { key: "tradeoffs", id: "tradeoffs", group: "outcome", label: "Trade-offs", title: (d) => d.title ?? "What made this hard", Content: Tradeoffs },
  { key: "outcomes", id: "outcomes", group: "outcome", label: "Outcomes", title: "Outcomes", Content: OutcomeBlock },
  { key: "reflection", id: "reflection", group: "outcome", label: "Reflection", title: "What I learned", Content: Reflection },
];

// Section navigation groups (desktop bar).
const GROUPS = [
  ["overview", "Overview"],
  ["problem", "Problem"],
  ["strategy", "Strategy"],
  ["decisions", "Decisions"],
  ["chapters"], // one item per chapter, labelled by the chapter
  ["solution", "Solution"],
  ["system", "System"],
  ["showcase", "Showcase"],
  ["website", "Website"],
  ["outcome", "Outcome"],
];

const hasContent = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value));

// A chapter as its own section: "01 / Design Studio" above its heading, and
// its own item in the section nav. A chapter with `stories` is a short
// project showcase (see ProjectShowcase) rather than a problem-solving chapter.
const chapterSection = (chapter, i) => ({
  key: "chapters",
  id: chapter.id,
  group: chapter.id,
  eyebrow: `${pad(i + 1)} / ${chapter.label}`,
  title: chapter.title,
  nav: chapter.nav ?? chapter.label,
  chapter,
  Content: chapter.stories ? ProjectShowcase : SolutionChapter,
});

// Optional per-study theme (data/case-studies/*.js → theme). Page-wide colours
// are set by the route; these are the case-study surfaces: the accent (numbers,
// step labels), image frames, the softer body text and the sticky section nav
// (light text on the surface). `stage` / `stageText` recolour the stage behind
// phone screens (and the hero frame) when the project's slide colours don't
// suit the page; `dark` ({ background, text, line, canvas }) colours sections
// listed in `tones`.
function themeVars(theme) {
  if (!theme) return {};
  return {
    ...(theme.stage && { "--p-bg": theme.stage, "--p-fg": theme.stageText ?? theme.background }),
    ...(theme.dark && {
      "--dark-bg": theme.dark.background,
      "--dark-fg": theme.dark.text,
      "--dark-line": theme.dark.line,
      "--dark-canvas": theme.dark.canvas ?? theme.dark.background,
    }),
    "--p-accent": theme.accent ?? theme.line,
    "--canvas": theme.surface,
    "--ink-soft": theme.text,
    "--nav-bg": `color-mix(in srgb, ${theme.surface} 94%, transparent)`,
    "--nav-fg": theme.background,
    "--nav-muted": `color-mix(in srgb, ${theme.background} 72%, ${theme.surface})`,
  };
}

export default function CaseStudy({ project, study, next }) {
  const inProgress = study.status === "in-progress";
  const sections = inProgress
    ? []
    : SECTIONS.filter((section) => hasContent(study[section.key])).flatMap((section) =>
        section.key === "chapters" ? study.chapters.map(chapterSection) : [section],
      );

  const navItems = GROUPS.flatMap(([id, label]) =>
    id === "chapters"
      ? sections.filter((section) => section.chapter).map(({ id, nav }) => ({ id, label: nav, target: id }))
      : [
          {
            id,
            label: study.navLabels?.[id] ?? label,
            target: id === "overview" ? "overview" : sections.find((section) => section.group === id)?.id,
          },
        ],
  ).filter((item) => item.target);

  return (
    <CaseStudyMotion
      aria-labelledby="case-title"
      className={styles.article}
      style={{
        "--p-bg": project.background,
        "--p-fg": project.foreground,
        "--p-accent": project.accent,
        ...themeVars(study.theme),
      }}
    >
      {navItems.length > 1 && <CaseNav title={project.title} items={navItems} />}

      <CaseHero project={project} study={study} />

      {sections.map(({ key, id, group, label, eyebrow, title, Content, chapter }, i) => {
        const data = chapter ?? study[key];
        const sectionLabel = study.labels?.[key] ?? label;
        return (
          <CaseSection
            key={id}
            id={id}
            group={group}
            number={pad(i + 1)}
            label={sectionLabel}
            eyebrow={eyebrow ?? (study.numbered === false ? sectionLabel : undefined)}
            tone={study.tones?.[key]}
            title={study.headings?.[key] ?? (typeof title === "function" ? title(data) : title)}
          >
            <Content data={data} />
          </CaseSection>
        );
      })}

      {inProgress && <InProgress project={project} />}

      {next && <NextProject project={next} />}
    </CaseStudyMotion>
  );
}

// Body paragraphs under a section heading.
function Body({ text }) {
  const list = paragraphs(text);
  if (!list.length) return null;
  return (
    <Row className={styles.headBody}>
      {list.map((line, i) => (
        <p key={i} data-reveal className={styles.body}>
          {copy(line)}
        </p>
      ))}
    </Row>
  );
}

// A labelled row of chips, e.g. research methods.
function ChipList({ label, items }) {
  if (!items?.length) return null;
  return (
    <Row className={styles.block}>
      <div data-reveal>
        <h3 className={styles.label}>{label}</h3>
        <ul className={styles.chips}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Row>
  );
}

// A short standalone line under a block (e.g. a one-line research note).
function Note({ text }) {
  if (!text) return null;
  return (
    <Row className={styles.block}>
      <p data-reveal className={styles.body}>
        {copy(text)}
      </p>
    </Row>
  );
}

// Numbered steps of a flow, e.g. Create centre → Add services → …
function Steps({ label, items }) {
  if (!items?.length) return null;
  return (
    <div data-reveal className={styles.block}>
      {label && <h3 className={styles.label}>{label}</h3>}
      <ol className={styles.list}>
        {items.map((step, i) => (
          <li key={step}>
            <span className={styles.label}>{pad(i + 1)}</span>
            <span>{copy(step)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The problem, optionally followed by who it affects (`users`) so a short
// case study can tell both in one section.
function Challenge({ data }) {
  return (
    <>
      <Body text={data.body} />
      {data.hmw && (
        <Row className={styles.block}>
          <p data-reveal className={styles.label}>
            {data.hmwLabel ?? "How might we"}
          </p>
          <p data-reveal className={styles.hmw}>
            {copy(data.hmw)}
          </p>
        </Row>
      )}
      {data.journey && <Journey data={data.journey} />}
      {data.problems?.length > 0 && (
        <Row>
          <ItemGrid items={data.problems} numbered />
        </Row>
      )}
      <Note text={data.note} />
      {data.users && <Users data={data.users} />}
      {data.media && <CaseMedia media={data.media} />}
    </>
  );
}

// A simple journey diagram: one lane per journey, each a run of steps with
// a short tag (e.g. how urgent it is). Drawn in HTML so it stays crisp.
function Journey({ data }) {
  return (
    <Row span="wide" className={styles.block}>
      {data.title && (
        <h3 data-reveal className={styles.label}>
          {copy(data.title)}
        </h3>
      )}
      <div className={styles.journey}>
        {data.lanes.map((lane) => (
          <div key={lane.title} data-reveal className={styles.lane}>
            <p className={styles.laneHead}>
              <span>{copy(lane.title)}</span>
              {lane.tag && <span className={styles.laneTag}>{copy(lane.tag)}</span>}
            </p>
            <ol className={styles.laneSteps}>
              {lane.steps.map((step) => (
                <li key={step}>{copy(step)}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Row>
  );
}

// The finished UI, mostly visual: an optional line, media blocks, then an
// optional closing note.
function Showcase({ data }) {
  return (
    <>
      <Body text={data.body} />
      {data.media?.map((media, i) => (
        <CaseMedia key={i} media={media} />
      ))}
      <Note text={data.note} />
    </>
  );
}

function Research({ data }) {
  return (
    <>
      <Body text={data.body} />
      <ChipList label="Research methods" items={data.methods} />
      <ChipList label="Competitors studied" items={data.competitors} />
      {data.insights?.length > 0 && (
        <Row className={styles.block}>
          {data.insightsTitle && (
            <h3 data-reveal className={styles.chapterGoal}>
              {copy(data.insightsTitle)}
            </h3>
          )}
          <ItemGrid items={data.insights} numbered level={data.insightsTitle ? 4 : 3} />
        </Row>
      )}
      {data.media && <CaseMedia media={data.media} />}
    </>
  );
}

// User groups; with a `title` they sit under a subheading inside another
// section. `ecosystem` adds a small live diagram of how the groups connect.
function Users({ data }) {
  return (
    <>
      <Row className={data.title ? styles.block : undefined}>
        {data.title && (
          <h3 data-reveal className={styles.chapterGoal}>
            {copy(data.title)}
          </h3>
        )}
        <ItemGrid items={data.groups} columns={3} level={data.title ? 4 : 3} />
      </Row>
      {data.ecosystem && <Ecosystem data={data.ecosystem} />}
    </>
  );
}

// Providers feed the platform from either side; consumers use it below.
function Ecosystem({ data }) {
  const [left, right] = data.providers;
  return (
    <div className={`${styles.grid} ${styles.figure}`}>
      <figure data-reveal="media" className={styles.main}>
        <figcaption className="sr-only">
          {`${left} and ${right} both feed ${data.hub}, which ${data.consumers} use.`}
        </figcaption>
        <div aria-hidden="true" className={styles.ecosystem}>
          <span className={styles.shiftItem}>{left}</span>
          <span className={styles.shiftArrow}>→</span>
          <span className={styles.shiftItem} data-new>
            {data.hub}
          </span>
          <span className={styles.shiftArrow}>←</span>
          <span className={styles.shiftItem}>{right}</span>
          <span className={`${styles.shiftArrow} ${styles.ecosystemDown}`}>↓</span>
          <span className={`${styles.shiftItem} ${styles.ecosystemBelow}`}>{data.consumers}</span>
        </div>
      </figure>
    </div>
  );
}

function Constraints({ data }) {
  return (
    <Row>
      <ItemGrid items={data.items} />
    </Row>
  );
}

// `layout: "flow"` shows the principles as one connected journey (a line
// across on desktop, down the side on smaller screens) instead of a grid.
function Approach({ data }) {
  return (
    <>
      <Body text={data.body} />
      {data.layout === "flow" ? (
        <Row span="full" className={styles.block}>
          <ol className={styles.strategy}>
            {data.principles.map((step, i) => (
              <li key={step.title} data-reveal className={styles.strategyStep}>
                <span aria-hidden="true" className={styles.strategyDot} />
                <span className={styles.strategyNumber}>{pad(i + 1)}</span>
                <h3 className={styles.strategyTitle}>{copy(step.title)}</h3>
                <p className={styles.strategyText}>{copy(step.text)}</p>
              </li>
            ))}
          </ol>
        </Row>
      ) : (
        <Row>
          <ItemGrid items={data.principles} numbered />
        </Row>
      )}
      {data.media && <CaseMedia media={data.media} />}
    </>
  );
}

function Decisions({ data }) {
  return data.map((decision, i) => <DesignDecision key={i} decision={decision} number={pad(i + 1)} />);
}

function Experience({ data }) {
  return data.map((chapter, i) => <ExperienceChapter key={i} chapter={chapter} number={pad(i + 1)} />);
}

// The provider side: what the CMS lets doctors and centres run, and why it
// was designed together with the consumer app.
// `relations`: what a provider sets → what the patient sees. `groups`: what
// each provider type manages. `progressive`: one key CMS decision as a
// subheading, a line, its steps and why.
function Operations({ data }) {
  const progressive = data.progressive;
  return (
    <>
      <Body text={data.body} />
      {data.relations?.length > 0 && (
        <Row>
          <ItemGrid items={data.relations} columns={3} />
        </Row>
      )}
      {data.groups?.length > 0 && (
        <Row>
          <ItemGrid items={data.groups} />
        </Row>
      )}
      {data.areas?.length > 0 && (
        <Row>
          <ItemGrid items={data.areas} numbered />
        </Row>
      )}
      {data.statement && (
        <Row className={styles.block}>
          <p data-reveal className={styles.chapterGoal}>
            {copy(data.statement)}
          </p>
        </Row>
      )}
      {progressive && (
        <Row className={styles.block}>
          <h3 data-reveal className={styles.chapterGoal}>
            {copy(progressive.title)}
          </h3>
          {paragraphs(progressive.body).map((text, i) => (
            <p key={i} data-reveal className={`${styles.body} mt-4`}>
              {copy(text)}
            </p>
          ))}
          <Steps items={progressive.steps} />
          {progressive.why && (
            <div data-reveal className={`${styles.result} mt-6`}>
              <span className={styles.label}>Why</span>
              <p>{copy(progressive.why)}</p>
            </div>
          )}
        </Row>
      )}
      {data.media && <CaseMedia media={data.media} />}
    </>
  );
}

// The marketing site: how it differs from the product UI, its journey, one
// visual, an optional live link ({ href, label }) and an optional closing note.
function Website({ data }) {
  return (
    <>
      <Body text={data.body} />
      {data.contrast?.length > 0 && (
        <Row>
          <ItemGrid items={data.contrast} />
        </Row>
      )}
      {data.journey?.length > 0 && (
        <Row>
          <Steps label={data.journeyLabel ?? "Website journey"} items={data.journey} />
        </Row>
      )}
      {data.media && <CaseMedia media={data.media} />}
      {data.link && (
        <Row span="full" className={styles.siteLinkRow}>
          <a data-reveal href={data.link.href} target="_blank" rel="noopener noreferrer" className={styles.siteLink}>
            {data.link.label}
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Row>
      )}
      <Note text={data.note} />
    </>
  );
}

function BeforeAfterSection({ data }) {
  return (
    <>
      <CaseMedia media={{ layout: "before-after", before: data.before, after: data.after, caption: data.caption }} />
      {data.changes?.length > 0 && (
        <Row className={styles.block}>
          <h3 className={styles.label}>What changed</h3>
          <ul className={styles.list}>
            {data.changes.map((change) => (
              <li key={change} data-reveal>
                {copy(change)}
              </li>
            ))}
          </ul>
        </Row>
      )}
    </>
  );
}

function Tradeoffs({ data }) {
  return (
    <>
      {data.items?.length > 0 && (
        <Row>
          <ItemGrid items={data.items} numbered />
        </Row>
      )}
      {(data.themes?.length > 0 || data.example) && (
        <Row className={styles.headBody}>
          {data.themes?.length > 0 && (
            <ul aria-label="Constraints along the way" className={styles.chips}>
              {data.themes.map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>
          )}
          {data.example && (
            <div data-reveal className={styles.item}>
              <p className={styles.label}>One example</p>
              <h3 className={styles.itemTitle}>{copy(data.example.title)}</h3>
              <p className={`${styles.body} mt-3`}>{copy(data.example.body)}</p>
            </div>
          )}
        </Row>
      )}
    </>
  );
}

// The first paragraph is the lead; any others follow as body text.
// `next` is up to three points, or a single paragraph.
function Reflection({ data }) {
  const [lead, ...rest] = paragraphs(data.body);
  return (
    <Row className={styles.headBody}>
      <p data-reveal className={styles.lead}>
        {copy(lead)}
      </p>
      {rest.map((text, i) => (
        <p key={i} data-reveal className={styles.body}>
          {copy(text)}
        </p>
      ))}
      {data.next?.length > 0 && (
        <div data-reveal className={styles.block}>
          <h3 className={styles.label}>{data.nextLabel ?? "If I continued this work"}</h3>
          {typeof data.next === "string" ? (
            <p className={`${styles.body} mt-4`}>{copy(data.next)}</p>
          ) : (
            <ol className={styles.list}>
              {data.next.slice(0, 3).map((point, i) => (
                <li key={i}>
                  <span className={styles.label}>{pad(i + 1)}</span>
                  <span>{copy(point)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </Row>
  );
}

function InProgress({ project }) {
  return (
    <section aria-labelledby="in-progress-title" className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.grid} ${styles.head}`}>
          <p className={`${styles.label} ${styles.side}`}>Case study</p>
          <div className={styles.main}>
            <h2 id="in-progress-title" className={styles.title}>
              The full story is being written.
            </h2>
            <p className={`${styles.body} ${styles.headBody}`}>
              The detailed {project.title} case study — the problem, key design decisions and outcomes — is
              coming soon. If you&apos;d like to hear about it now,{" "}
              <a href={contactLink.href} className="underline underline-offset-4">
                get in touch
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
