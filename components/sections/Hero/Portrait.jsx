import { getImageProps } from "next/image";
import { preload } from "react-dom";
import EditablePortrait from "./EditablePortrait";

// Layers, outermost first — each owns one kind of motion so they never fight:
//   [data-portrait-move]  cursor drift (HeroMotion)
//   [data-anim=portrait-clip]  clip-path reveal
//   [data-anim=portrait-img]   scale/offset settle + hover chromatic split
// With a photo, EditablePortrait renders these layers as an SVG mask that can
// be reshaped on desktop; without one, a static placeholder stands in.
export default function Portrait({ src, alt, caption }) {
  return (
    <figure className="relative w-full">
      {src ? (
        <EditablePortrait src={portraitUrl(src)} alt={alt} />
      ) : (
        <div data-portrait-move className="will-change-transform">
          <div
            data-anim="portrait-clip"
            className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-[#dcd6cb]"
          >
            <div data-anim="portrait-img" className="absolute inset-0">
              <PortraitPlaceholder />
            </div>
          </div>
        </div>
      )}

      <figcaption
        data-anim="copy"
        className="mt-3 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground"
      >
        {caption.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </figcaption>

      <RgbSplitFilter />
    </figure>
  );
}

// An SVG <image> has no srcset, so it gets one optimised file: the 2×
// candidate for a 540px-wide image, i.e. Next's 1080w WebP — sharp up to
// ~540 CSS px on retina screens and under half the original's weight. It's
// the hero's largest image, so it's preloaded (as next/image's `preload` did).
function portraitUrl(src) {
  const { props } = getImageProps({ src, alt: "", width: 540, height: 640 });
  preload(props.src, { as: "image", fetchPriority: "high" });
  return props.src;
}

function PortraitPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-end p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
        Portrait
      </span>
    </div>
  );
}

// Splits the image into R/G/B channels and recombines them with `screen`.
// With both offsets at 0 the output is identical to the source; HeroMotion
// nudges the red and blue offsets briefly on hover.
function RgbSplitFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="hero-rgb-split" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feOffset in="red" dx="0" data-rgb="red" result="redShifted" />
        <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feOffset in="blue" dx="0" data-rgb="blue" result="blueShifted" />
        <feBlend in="redShifted" in2="green" mode="screen" result="redGreen" />
        <feBlend in="redGreen" in2="blueShifted" mode="screen" />
      </filter>
    </svg>
  );
}
