// The oversized name. Each word is a clipping mask and each letter can rise
// out of it independently. Screen readers get the plain name once.
//
// Sizes use container-query units (cqw) of the hero's @container so the
// name spans the content width exactly. Measured set widths (Manrope): MANOJ ≈ 3.17em,
// RAWAT ≈ 3.26em.
//   base: stacked, widest word fills the width
//   md:   one line, words pushed to the edges
//   lg:   words sized to 38.5cqw so a 25cqw portrait can sit between them

export default function HeroName({ name }) {
  const words = name.toUpperCase().split(" ");

  return (
    <h1 className="relative z-0 text-accent font-semibold leading-[0.8] tracking-[-0.055em] text-[calc(100cqw/3.37)] md:flex md:justify-between md:text-[calc(100cqw/6.71)] lg:text-[11.8cqw]">
      <span className="sr-only">{name}</span>
      {words.map((word, w) => (
        <span
          key={word}
          aria-hidden="true"
          className={`-mx-[0.03em] block overflow-hidden px-[0.03em] pt-[0.06em] pb-[0.02em] ${w === words.length - 1 ? "lg:hidden" : ""}`}
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
// by Hero next to the role). Decorative; HeroName already names the page.
export function HeroNameTail({ name }) {
  const word = name.toUpperCase().split(" ").pop();
  return (
    <span
      aria-hidden="true"
      className="-mx-[0.03em] hidden overflow-hidden whitespace-nowrap px-[0.03em] pt-[0.06em] pb-[0.02em] text-right font-semibold leading-[0.8] tracking-[-0.055em] text-accent lg:-ml-[3cqw] lg:block lg:text-[11.8cqw]"
    >
      {[...word].map((char, i) => (
        <span key={i} data-anim="char" className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}
