// The oversized name. Each word is a clipping mask and each letter can rise
// out of it independently. Screen readers get the plain name once.
//
// Sizes use container-query units (cqw) of the hero's @container so the
// name spans the content width exactly. Set in Clash Display Medium, in
// capitals; measured widths (-0.055em tracking): MANOJ ≈ 3.49em, RAWAT ≈ 3.62em.
//   base: stacked, widest word fills the width
//   md:   one line, words pushed to the edges
//   lg:   7.8cqw, so each word (MANOJ ≈ 27.2cqw, RAWAT ≈ 28.2cqw) fits in
//         a side column beside the large portrait (at most 41.6cqw wide):
//         MANOJ ends just short of the head (--lead, set in Hero), RAWAT
//         starts just right of the portrait

// One word's mask: the line, with room for the letters' overhang and the
// descender of the "j" (the bottom padding is cancelled by the margin, so
// the layout doesn't change).
const BAND = "-mx-[0.03em] -mb-[0.22em] block overflow-hidden px-[0.03em] pt-[0.06em] pb-[0.24em]";

export default function HeroName({ name }) {
  const words = name.toUpperCase().split(" ");

  return (
    <h1 className="relative z-0 font-display text-accent font-medium leading-[0.8] tracking-[-0.055em] text-[calc(100cqw/3.74)] md:flex md:justify-between md:text-[calc(100cqw/7.4)] lg:text-[7.8cqw]">
      <span className="sr-only">{name}</span>
      {words.map((word, w) => (
        <span
          key={word}
          aria-hidden="true"
          data-hero-word
          // lg: the first word ends just short of the portrait's head; the
          // last moves right of the portrait (HeroNameTail).
          className={`${BAND} ${w === words.length - 1 ? "lg:hidden" : "lg:pl-(--lead)"}`}
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

// lg: the last word moves a line down, right of the portrait (rendered by
// Hero above the role).
// Decorative; HeroName already names the page.
export function HeroNameTail({ name }) {
  const word = name.toUpperCase().split(" ").pop();
  return (
    <span
      aria-hidden="true"
      data-hero-word
      className={`-mx-[0.03em] -mb-[0.22em] hidden overflow-hidden whitespace-nowrap px-[0.03em] pt-[0.06em] pb-[0.24em] font-display font-medium leading-[0.8] tracking-[-0.055em] text-accent lg:ml-[0.5cqw] lg:block lg:text-[7.8cqw]`}
    >
      {[...word].map((char, i) => (
        <span key={i} data-anim="char" className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}
