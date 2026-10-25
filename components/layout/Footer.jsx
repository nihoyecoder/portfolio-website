import Link from "next/link";
import { Fragment } from "react";
import RollingText from "@/components/ui/RollingText";
import { footerIntro, footerNav, footerSocials } from "@/data/footer";
import { contactDetails } from "@/lib/config/contact";
import { site } from "@/lib/site";
import FooterMotion from "./FooterMotion";
import styles from "./Footer.module.css";

const meta = "font-mono text-[11px] uppercase tracking-[0.08em] text-muted";

// The closing signature: a calm, light layer after the dark Contact section.
export default function Footer() {
  const words = footerIntro.heading.split(" ");
  const { email, phone } = contactDetails;

  return (
    <FooterMotion className={styles.root} aria-labelledby="footer-heading">
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.lead}>
            <h2
              id="footer-heading"
              data-footer-rise
              className="text-[clamp(2.5rem,10vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em] lg:text-[clamp(3rem,4.6vw,4.75rem)]"
            >
              {words.map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span
                    className={
                      word.replace(/\W/g, "") === footerIntro.accentWord
                        ? "font-serif text-[1.08em] font-normal tracking-[-0.01em] text-accent"
                        : undefined
                    }
                  >
                    {word}
                  </span>
                </Fragment>
              ))}
            </h2>
            <p data-footer-rise className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-muted">
              {footerIntro.intro}
            </p>

            <address data-footer-rise className={styles.contact}>
              {email && (
                <a href={`mailto:${email}`} className={styles.contactLink}>
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={styles.contactLink}>
                  {phone}
                </a>
              )}
            </address>

            {footerSocials.length > 0 && (
              <ul aria-label="Profiles" className={styles.socials}>
                {footerSocials.map(({ id, label, href }) => (
                  <li key={id} data-footer-rise>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className={styles.social}
                    >
                      <SocialIcon id={id} />
                      <span aria-hidden="true" className={styles.tooltip}>
                        {label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className={styles.nav}>
            {footerNav.map((group) => (
              <div key={group.label} data-footer-rise>
                <h3 className={meta}>{group.label}</h3>
                <ul className={styles.navList}>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div data-footer-rise className={`${styles.utility} ${meta}`}>
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>{contactDetails.location}</p>
          <p>Designed &amp; built with {site.stack}</p>
        </div>
      </div>

      {/* Closing signature — decorative; the name is already in the page. */}
      <div aria-hidden="true" className={styles.signature}>
        <p data-footer-name className={styles.name}>
          <span>Manoj</span> <span>Rawat</span>
        </p>
      </div>
    </FooterMotion>
  );
}

function FooterLink({ label, href, external, download }) {
  const className = `group ${styles.navLink}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <RollingText>{label}</RollingText>
        <span aria-hidden="true" className={styles.navArrow}>
          ↗
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  // Plain links for section anchors: a same-page jump on the home page, a
  // full load (so sections are measured before scrolling) from elsewhere.
  if (download || href.includes("#")) {
    return (
      <a href={href} download={download} className={className}>
        <RollingText>{label}</RollingText>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      <RollingText>{label}</RollingText>
    </Link>
  );
}

function SocialIcon({ id }) {
  const paths = {
    linkedin:
      "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45Z",
    github:
      "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.37.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3",
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.socialIcon}>
      <path fill="currentColor" d={paths[id]} />
    </svg>
  );
}
