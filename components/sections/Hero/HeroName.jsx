// The oversized name. Each word is a clipping mask and each letter can rise
// out of it independently. Screen readers get the plain name once.
//
// Hovering a word (mouse/trackpad only) drops it into a solid accent band with
// the letters knocked out in the page colour. The band is a layer behind the
// letters covering the cap height across the whole word, so the resting
// layout is unchanged; on desktop it runs on behind the portrait.
//
// Sizes use container-query units (cqw) of the hero's @container so the
// name spans the content width exactly. Measured set widths (Manrope): MANOJ ≈ 3.17em,
// RAWAT ≈ 3.26em.
//   base: stacked, widest word fills the width
//   md:   one line, words pushed to the edges
//   lg:   words sized to 38.5cqw so a 25cqw portrait can sit between them

// Tailwind's hover: only applies on devices that can hover.
const HOVER_BAND = [
  "relative isolate hover:text-background motion-safe:transition-colors motion-safe:duration-300",
  "before:absolute before:inset-x-0 before:top-[0.06em] before:bottom-[0.02em] before:-z-10 before:bg-accent before:opacity-0",
  "hover:before:opacity-100 motion-safe:before:transition-opacity motion-safe:before:duration-300",
].join(" ");
const BAND = `-mx-[0.03em] block overflow-hidden px-[0.03em] pt-[0.06em] pb-[0.02em] ${HOVER_BAND}`;

export default function HeroName({ name }) {
  const words = name.toUpperCase().split(" ");

  return (
    <h1 className="relative z-0 text-accent font-semibold leading-[0.8] tracking-[-0.055em] text-[calc(100cqw/3.37)] md:flex md:justify-between md:text-[calc(100cqw/6.71)] lg:text-[11.8cqw]">
      <span className="sr-only">{name}</span>
      {words.map((word, w) => (
        <span
          key={word}
          aria-hidden="true"
          data-hero-word
          // lg: the first word's band carries on under the portrait.
          className={`${BAND} ${w === words.length - 1 ? "lg:hidden" : "lg:w-[42cqw]"}`}
        >
          {[...word].map((char, i) => (
            <span key={i} data-anim="char" className="inline-block">
              {char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// lg: the last word moves down beside the bottom of the portrait (rendered
// by Hero next to the role). Its hover band starts behind the portrait.
// Decorative; HeroName already names the page.
export function HeroNameTail({ name }) {
  const word = name.toUpperCase().split(" ").pop();
  return (
    <span
      aria-hidden="true"
      data-hero-word
      className={`-mx-[0.03em] hidden overflow-hidden whitespace-nowrap px-[0.03em] pt-[0.06em] pb-[0.02em] text-right font-semibold leading-[0.8] tracking-[-0.055em] text-accent lg:-ml-[3cqw] lg:block lg:text-[11.8cqw] ${HOVER_BAND}`}
    >
      {[...word].map((char, i) => (
        <span key={i} data-anim="char" className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}
