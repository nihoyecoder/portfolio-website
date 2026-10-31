import fs from "node:fs";
import path from "node:path";
import { HeaderSpace } from "@/components/layout/Header";
import CursorGrid from "@/components/ui/CursorGrid";
import { profile } from "@/data/profile";
import { site } from "@/lib/site";
import HeroMotion from "./HeroMotion";
import HeroName, { HeroNameTail } from "./HeroName";
import HeroToolStrings from "./HeroToolStrings";
import Portrait from "./Portrait";
import styles from "./Hero.module.css";

const PORTRAIT_SRC = "/images/about/manoj-hero.webp";

// Full-strength text: it sits on the rose gradient.
const meta = "font-mono text-[11px] uppercase tracking-[0.08em] text-foreground";

// Wraps text in a clipping mask so the timeline can raise it into view.
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

      {/* Background: a grid the cursor reveals (desktop pointer only) */}
      <CursorGrid />

      {/* The header itself is fixed (rendered by the page) */}
      <HeaderSpace />

      <div className="flex flex-1 flex-col justify-center pt-12 md:pt-8">
        {/*
          One container for name + body so both share cqw units.
          base: stacked column · md: copy left / portrait right ·
          lg: portrait pierces the name between the two words.
        */}
        <div className="@container">
          <HeroName name={site.name} />

          <div className="mt-6 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 lg:mt-0 lg:grid-cols-[1fr_22cqw_1fr] lg:gap-x-0">
            {/* Role and current job — lg: RAWAT, the role and the job sit beside
                the portrait, starting just right of it; the block ends a little
                above the image's bottom (27px clears the caption). */}
            <div className="md:col-start-1 md:row-start-1 md:pt-4 lg:col-start-3 lg:row-start-2 lg:self-end lg:pt-0 lg:mb-[calc(27px+5cqw)]">
              <HeroNameTail name={site.name} />
              {/* lg: a clear gap under RAWAT, in line with its R */}
              <div className="lg:mt-[2.6cqw] lg:pl-[1.6cqw]">
                <p className="font-display text-[clamp(1.5rem,2.1vw,2rem)] font-medium leading-[1.05] tracking-[-0.02em]">
                  <MaskLine>{profile.role}</MaskLine>
                </p>
                <p className={`mt-2.5 ${meta}`}>
                  <MaskLine>
                    <span className="opacity-70">Currently</span> {profile.current.title} at{" "}
                    <span className="whitespace-nowrap">{profile.current.company}</span>
                  </MaskLine>
                </p>
              </div>
            </div>

            {/* Portrait — on desktop the tool strings hang behind it. */}
            <div className="relative z-10 ml-auto w-[64%] max-w-[21rem] md:col-start-2 md:row-span-3 md:row-start-1 md:-mt-[3.8cqw] md:w-[88%] md:max-w-none lg:w-full lg:row-span-2 lg:-mt-[9.7cqw]">
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
              className="max-w-[46ch] text-balance text-[clamp(1rem,1.2vw,1.125rem)] leading-snug text-foreground lg:max-w-none md:col-start-1 md:row-start-3 md:self-end lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start lg:ml-[9.6cqw] lg:mr-[0.8cqw] lg:pt-[2.6cqw]"
            >
              {profile.statement}
            </p>
          </div>
        </div>
      </div>
    </HeroMotion>
  );
}
