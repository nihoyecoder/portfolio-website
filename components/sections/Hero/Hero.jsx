import fs from "node:fs";
import path from "node:path";
import { HeaderSpace } from "@/components/layout/Header";
import CursorGrid from "@/components/ui/CursorGrid";
import { profile } from "@/data/profile";
import { site } from "@/lib/site";
import HeroMotion from "./HeroMotion";
import HeroName, { HeroNameTail } from "./HeroName";
import Portrait from "./Portrait";
import styles from "./Hero.module.css";

// The cut-out portrait (transparent WebP) at its real size. To replace it,
// give the new file a new name: next.config.mjs caches images for 31 days.
const PORTRAIT = { src: "/images/about/manoj-hero-cutout.webp", width: 1122, height: 1402 };

// Full-strength text: it sits on the rose gradient.
const meta = "text-[11px] uppercase tracking-[0.08em] text-foreground";

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
  const hasPortrait = fs.existsSync(path.join(process.cwd(), "public", PORTRAIT.src));

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

      {/* lg: the whole composition sits 5% of the screen's height below
          centre, a little further from the nav (the portrait's faded bottom
          still ends inside the screen). Relative, so nothing reflows. */}
      <div className="flex flex-1 flex-col justify-center pt-12 md:pt-8 lg:relative lg:top-[5svh]">
        {/*
          One container for name + body so both share cqw units.
          base: stacked column · md: copy left / portrait right ·
          lg: a large portrait between the two words, about 78% of the
          screen's height tall. --pw is its width, capped so the words fit
          either side. --lead moves MANOJ and the statement right, so MANOJ
          ends 13% of the way into the portrait's box, about 80px short of
          the hair: (100cqw − pw) / 2 + 0.13 pw − 27.22cqw (MANOJ is 3.49em
          of the 7.8cqw name). Tuned to this photo's head position.
        */}
        <div className="@container lg:[--lead:calc(22.78cqw_-_var(--pw)*0.37)] lg:[--pw:min(41.6cqw,62.4svh)]">
          <HeroName name={site.name} />

          <div className="mt-6 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 lg:mt-0 lg:grid-cols-[1fr_var(--pw)_1fr] lg:gap-x-0">
            {/* Role and current job — lg: RAWAT, the role and the job sit right
                of the portrait, a line below MANOJ, beside the head, where the
                cut-out leaves room (its shoulders start halfway down). */}
            <div className="md:col-start-1 md:row-start-1 md:pt-4 lg:col-start-3 lg:row-start-1 lg:self-start lg:-ml-[2cqw] lg:pt-[1.2cqw]">
              <HeroNameTail name={site.name} />
              {/* lg: a clear gap under RAWAT, in line with its R */}
              <div className="lg:mt-[2.6cqw] lg:pl-[1.6cqw]">
                {/* lg: a smaller floor so it stays on one line in the narrower
                    side column (from 1024px wide). */}
                <p className="font-display text-[clamp(1.5rem,2.1vw,2rem)] font-medium leading-[1.05] tracking-[-0.02em] lg:text-[clamp(1.25rem,2.1vw,2rem)]">
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

            {/* Portrait: a cut-out that drifts with the cursor. lg: its top sits
                a little above MANOJ. */}
            <div className="relative z-10 ml-auto w-[84%] max-w-[26rem] md:col-start-2 md:row-span-3 md:row-start-1 md:w-full md:max-w-none lg:w-full lg:row-span-2 lg:-mt-[9.4cqw]">
              <Portrait image={{ ...PORTRAIT, src: hasPortrait ? PORTRAIT.src : null }} alt={`Portrait of ${site.name}`} />
            </div>

            {/* Statement — lg: under MANOJ, from its first letter to 16% into
                the portrait's box (clear at these heights: the face starts at
                24%). A little wider than the word, so it wraps into three
                lines at 1280px too; balanced, the longest ends near MANOJ's J. */}
            <p
              data-anim="copy"
              className="max-w-[46ch] text-balance text-[clamp(1rem,1.2vw,1.125rem)] leading-snug text-foreground lg:max-w-none md:col-start-1 md:row-start-3 md:self-end lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start lg:ml-(--lead) lg:-mr-[calc(var(--pw)*0.16)] lg:pt-[2.6cqw]"
            >
              {profile.statement}
            </p>
          </div>
        </div>
      </div>
    </HeroMotion>
  );
}
