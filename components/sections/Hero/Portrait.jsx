import Image from "next/image";

// The hero portrait: a cut-out photo standing on the hero's gradient. Its
// bottom is a soft mist, faded out a little more so it dissolves into the
// page. Layers, outermost first, each with one kind of motion so they never
// fight:
//   [data-portrait-move]       drift with the cursor (HeroMotion)
//   [data-anim=portrait-clip]  the intro's reveal, rising from the bottom
//   [data-anim=portrait-img]   the intro's settle
// Without the file, a neutral placeholder of the same shape stands in.

// Its width (Hero.jsx): 84% of the column on phones (26rem at most), the
// right half on tablets, and on desktop the middle column, about 78% of the
// screen's height tall (min(41.6cqw, 62.4svh) wide).
const SIZES = "(min-width: 1024px) min(42vw, 63vh), (min-width: 768px) 46vw, min(84vw, 416px)";

export default function Portrait({ image, alt }) {
  return (
    <div data-portrait-move className="will-change-transform">
      <div data-anim="portrait-clip">
        {image.src ? (
          // The hero's largest image, so it's preloaded.
          <Image
            data-anim="portrait-img"
            src={image.src}
            alt={alt}
            width={image.width}
            height={image.height}
            sizes={SIZES}
            preload
            className="block h-auto w-full [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]"
          />
        ) : (
          <div
            data-anim="portrait-img"
            className="relative flex items-end rounded-[3px] bg-[#dcd6cb] p-4"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Portrait</span>
          </div>
        )}
      </div>
    </div>
  );
}
