import Image from "next/image";
import Link from "next/link";
import { visualSize } from "@/data/projects";
import ArrowIcon from "@/components/ui/ArrowIcon";
import CaseImage from "./CaseImage";
import { copy } from "./CaseText";
import styles from "./CaseStudy.module.css";

// Overview: title and category beside a short summary (and optional
// subheadline) and the project facts, then one large visual. `study.title`
// overrides the project title on this page only. `data-intro` marks what the
// intro animates.
export default function CaseHero({ project, study }) {
  const lead = project.visuals[0];
  const hero = study.hero ?? { ...lead, ...visualSize, label: `${project.title} · ${lead.label}` };

  return (
    <header id="overview" data-nav-group="overview" className={styles.hero}>
      <noscript>
        <style>{"[data-intro]{visibility:visible!important;animation:none!important}"}</style>
      </noscript>

      <div className={styles.container}>
        <Link href="/#work" data-intro className={`${styles.back} ${styles.label}`}>
          <span aria-hidden="true" className="flex">
            <ArrowIcon direction="left" />
          </span>
          Back to work
        </Link>

        <div data-case-hero-intro className={`${styles.grid} ${styles.heroGrid}`}>
          <div className={styles.side}>
            <h1 id="case-title" className={styles.heroTitle}>
              <span className={styles.mask}>
                <span data-intro data-intro-title>
                  {study.title ?? project.title}
                </span>
              </span>
            </h1>
            <p data-intro className={`${styles.label} ${styles.heroCategory}`}>
              {study.category ?? project.subtitle}
            </p>
          </div>

          <div className={styles.main}>
            <p data-intro className={styles.heroSummary}>
              {copy(study.summary ?? project.description)}
            </p>
            {study.subheadline && (
              <p data-intro className={`${styles.body} ${styles.heroSub}`}>
                {copy(study.subheadline)}
              </p>
            )}

            {study.meta?.length > 0 && (
              <dl className={styles.meta}>
                {study.meta.map(({ label, value }) => (
                  <div key={label} data-intro>
                    <dt className={styles.label}>{label}</dt>
                    <dd className={styles.metaValue}>
                      {Array.isArray(value)
                        ? value.map((line) => (
                            <span key={line} className="block">
                              {copy(line)}
                            </span>
                          ))
                        : copy(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div data-intro data-intro-media className={styles.heroVisual}>
          {study.heroScreens ? (
            <HeroScreens screens={study.heroScreens} logo={study.logo} />
          ) : study.heroPair ? (
            // Two projects side by side (e.g. a multi-project page).
            <div className={styles.heroPair}>
              {study.heroPair.map((image, i) => (
                <CaseImage
                  key={image.src}
                  image={image}
                  preload={i === 0}
                  sizes="(min-width: 768px) 46vw, 94vw"
                />
              ))}
            </div>
          ) : study.heroStage ? (
            // One product screen rising out of the project stage, with a glow.
            <div className={styles.heroStage}>
              <div className={styles.heroShot}>
                <CaseImage image={hero} preload sizes="(min-width: 1440px) 1150px, 90vw" />
              </div>
            </div>
          ) : (
            <CaseImage image={hero} tone="project" preload sizes="(min-width: 1440px) 1360px, 94vw" />
          )}
        </div>
      </div>
    </header>
  );
}

// Three app screens overlapping on the project stage (centre one in front),
// with an optional logo. The middle screen is the lead, so it's preloaded.
function HeroScreens({ screens, logo }) {
  return (
    <div className={styles.heroStage}>
      {logo && (
        <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={styles.heroLogo} />
      )}
      <div className={styles.heroPhones}>
        {screens.slice(0, 3).map((screen, i) => (
          <div key={screen.src} className={styles.heroPhone} data-position={["left", "centre", "right"][i]}>
            <CaseImage image={screen} compact preload={i === 1} sizes="(min-width: 1024px) 22vw, 40vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
