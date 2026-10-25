import Image from "next/image";
import { Fragment } from "react";
import { contactIntro } from "@/data/contact";
import { publicFileExists } from "@/lib/assets";
import { site } from "@/lib/site";
import styles from "./Contact.module.css";

const PORTRAIT_SRC = "/images/about/manoj-contact.webp";

// Left column content: heading, intro and portrait. Rendered on the server;
// ContactExperience appends the mode switch below the portrait. Nothing here
// changes when the mode changes.
export default function ContactIdentity() {
  const words = contactIntro.heading.split(" ");
  const hasPortrait = publicFileExists(PORTRAIT_SRC);

  return (
    <>
      <div className={styles.intro}>
        <h2
          id="contact-heading"
          className="text-[clamp(2.75rem,12vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[clamp(3rem,min(4.6vw,9svh),4.75rem)]"
        >
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              {/* Mask with room for descenders */}
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                <span
                  data-contact-word
                  className={
                    word.replace(/\W/g, "") === contactIntro.accentWord
                      ? "inline-block pr-[0.04em] font-serif text-[1.08em] font-normal tracking-[-0.01em] text-accent"
                      : "inline-block"
                  }
                >
                  {word}
                </span>
              </span>
            </Fragment>
          ))}
        </h2>
        <p data-contact-fade className={styles.lede}>
          {contactIntro.intro}
        </p>
      </div>

      <div className={styles.portrait}>
        <div data-contact-clip className={styles.portraitFrame}>
          {hasPortrait ? (
            <Image
              src={PORTRAIT_SRC}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 46vw, 92vw"
              className="object-contain"
            />
          ) : (
            <div aria-hidden="true" className={styles.portraitPlaceholder}>
              <span>Contact portrait</span>
              <span>1600 × 1200</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
