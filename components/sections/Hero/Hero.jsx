import fs from "node:fs";
import path from "node:path";
import { Fragment } from "react";
import { HeaderSpace } from "@/components/layout/Header";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";
import LocalTime from "@/components/ui/LocalTime";
import { profile } from "@/data/profile";
import { site } from "@/lib/site";
import HeroMotion from "./HeroMotion";
import HeroName, { HeroNameTail } from "./HeroName";
import HeroToolStrings from "./HeroToolStrings";
import Portrait from "./Portrait";
import styles from "./Hero.module.css";

const PORTRAIT_SRC = "/images/about/manoj-hero.webp";

const meta = "font-mono text-[11px] uppercase tracking-[0.08em] text-muted";

// Wraps text in a clipping mask so the timeline can raise it into view.
// "a · b · c" that wraps only between items, never inside one, and keeps
// each dot at the end of its line.
function DotList({ items }) {
  return items.map((item, i) => (
    <Fragment key={item}>
      {i > 0 && " · "}
      <span className="whitespace-nowrap">{item}</span>
    </Fragment>
  ));
}

function MaskLine({ children, className = "" }) {
  return (
    // Padding (cancelled by the margin) gives descenders like g and y room
    // inside the clip without moving anything.
    <span className="-mb-[0.2em] block overflow-hidden pb-[0.2em]">
      <span data-anim="line" className={`block ${className}`}>
        {children}
      </span>
    </span>
  );
}

export default function Hero() {
  // Checked on the server; falls back to a neutral placeholder until the file exists.
  const hasPortrait = fs.existsSync(path.join(process.cwd(), "public", PORTRAIT_SRC));

  return (
    <HeroMotion
      data-hero
      aria-label="Introduction"
      className={`${styles.root} relative flex min-h-svh flex-col overflow-x-clip px-(--gutter) pt-5 pb-6 [--gutter:1.25rem] md:pt-6 md:[--gutter:2rem] xl:[--gutter:2.5rem]`}
    >
      <noscript>
        <style>{"[data-hero],[data-site-header] [data-anim]{visibility:visible!important}"}</style>
      </noscript>

      {/* The header itself is fixed (rendered by the page) */}
      <HeaderSpace />

      <div className="flex flex-1 flex-col justify-center pt-12 md:pt-8">
        <div className={`mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 md:mb-5 ${meta}`}>
          <AvailabilityBadge data-anim="meta">{site.availability}</AvailabilityBadge>
          {/* The current job, visible before any scrolling. */}
          <p data-anim="meta">
            <span className="opacity-70">Currently</span> {profile.current.title} at{" "}
            <span className="whitespace-nowrap">{profile.current.company}</span>
          </p>
          <p data-anim="meta">
            {site.location} <span aria-hidden="true">·</span>{" "}
            <LocalTime timeZone={site.timeZone} label={site.timeZoneLabel} />
          </p>
        </div>

        {/*
          One container for name + body so both share cqw units.
          base: stacked column · md: copy left / portrait right ·
          lg: portrait pierces the name between the two words.
        */}
        <div className="@container">
          <HeroName name={site.name} />

          <div className="mt-6 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 lg:mt-0 lg:grid-cols-[1fr_25cqw_1fr] lg:gap-x-0">
            {/* Role — lg: RAWAT + role sit beside the portrait, ending flush with the
                image (27px clears the caption: mt-3 + one 15px line). */}
            <div className="md:col-start-1 md:row-start-1 md:pt-4 lg:col-start-3 lg:row-start-2 lg:self-end lg:pt-0 lg:mb-[27px]">
              <HeroNameTail name={site.name} />
              {/* One role; the descriptor supports it without competing. */}
              <div className="lg:mt-4 lg:pl-[3cqw]">
                <p className="text-[clamp(1.5rem,2.1vw,2rem)] leading-[1.05] tracking-[-0.035em]">
                  <MaskLine>{profile.role}</MaskLine>
                </p>
                <p className={`mt-2.5 ${meta}`}>
                  <MaskLine>
                    <DotList items={profile.descriptor} />
                  </MaskLine>
                </p>
              </div>
            </div>

            {/* Portrait — on desktop the tool strings hang behind it. */}
            <div className="relative z-10 ml-auto w-[72%] max-w-sm md:col-start-2 md:row-span-3 md:row-start-1 md:-mt-[5cqw] md:w-full md:max-w-none lg:row-span-2 lg:-mt-[11.5cqw]">
              <HeroToolStrings />
              <Portrait
                src={hasPortrait ? PORTRAIT_SRC : null}
                alt={`Portrait of ${site.name}`}
                caption={["Fig. 01", site.name]}
              />
            </div>

            {/* Statement */}
            <p
              data-anim="copy"
              className="max-w-[46ch] text-balance text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-muted lg:max-w-[min(46ch,calc(100%+20cqw-3rem))] md:col-start-1 md:row-start-3 md:self-end lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start lg:pt-6 lg:pr-[3cqw] lg:-mr-[20cqw] lg:relative lg:z-20"
            >
              {profile.statement}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-end gap-x-8 gap-y-6 md:mt-0 lg:-mt-16 md:grid-cols-2">
        <div data-anim="scroll" aria-hidden="true" className={`hidden flex-col items-center gap-3 md:flex ${meta}`}>
          <span>Scroll</span>
          <span className={styles.scrollLine} />
        </div>

        <p data-anim="scroll" className={`md:text-right ${meta}`}>
          <span className="opacity-70">Designing across</span> <DotList items={profile.domains} />
        </p>
      </div>
    </HeroMotion>
  );
}
