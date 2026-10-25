"use client";

import { useId, useRef } from "react";
import { BOX, BOX_STYLE, REST, REST_PATH, VIEWBOX } from "./portraitShape";
import useEditableMask from "./useEditableMask";

// The hero portrait as an SVG image inside a clipping path. At rest the path
// is the same 3:4 frame as before; on desktop it becomes an editable vector
// (useEditableMask). Only the boundary ever changes — the photo is never
// stretched or warped.
//
// Renders the layers HeroMotion animates: data-portrait-move (cursor drift),
// data-anim="portrait-clip" (reveal) and data-anim="portrait-img" (zoom settle
// and hover chromatic split — on the <image> itself, so both stay inside the
// mask). Lives inside Portrait's <figure>, which positions the caption-row
// slot below.
export default function EditablePortrait({ src, alt }) {
  const clipId = `${useId()}mask`;
  const frame = useRef(null);
  const image = useRef(null);
  const mask = useRef(null);
  const overlay = useRef(null);
  const outline = useRef(null);
  const hint = useRef(null);
  const reset = useRef(null);
  useEditableMask({ frame, image, mask, overlay, outline, hint, reset });

  return (
    <>
      <div data-portrait-move className="will-change-transform">
        <div ref={frame} data-anim="portrait-clip" className="relative aspect-[3/4]">
          {/* Both SVGs cover the frame plus the photo's bleed (see portraitShape). */}
          <svg
            role="img"
            aria-label={alt}
            viewBox={VIEWBOX}
            className="pointer-events-none absolute overflow-visible"
            style={BOX_STYLE}
          >
            <defs>
              <clipPath id={clipId}>
                <path ref={mask} d={REST_PATH} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} fill="#dcd6cb" />
              <image
                ref={image}
                data-anim="portrait-img"
                href={src}
                x={BOX.x}
                y={BOX.y}
                width={BOX.w}
                height={BOX.h}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </svg>

          {/* Editing layer: outline and anchors, hidden until the cursor comes close. */}
          <svg
            ref={overlay}
            aria-hidden="true"
            viewBox={VIEWBOX}
            className="pointer-events-none absolute overflow-visible"
            style={BOX_STYLE}
          >
            <path
              ref={outline}
              d={REST_PATH}
              className="fill-none stroke-accent opacity-0 [vector-effect:non-scaling-stroke]"
            />
            {REST.map(({ x, y }, i) => (
              <g key={i} data-handle="" transform={`translate(${x} ${y})`}>
                <g>
                  <circle
                    r="3.5"
                    className="fill-background stroke-accent opacity-0 transition-[fill] duration-200 [stroke-width:1.25] [vector-effect:non-scaling-stroke] data-active:fill-accent"
                  />
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Caption-row slot, outside the drifting layer so it lines up with the
          caption, and above it (the intro leaves the caption transformed, which
          would otherwise paint over Reset and take its taps). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid place-items-center font-mono text-[10px] uppercase tracking-[0.08em]">
        <span
          ref={hint}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 inline-flex items-center gap-2 text-accent opacity-0"
        >
          <span className="size-[7px] rounded-full border border-accent bg-background" />
          Drag to reshape
        </span>
        <button
          ref={reset}
          type="button"
          aria-label="Reset portrait shape"
          className="pointer-events-auto invisible col-start-1 row-start-1 -my-1 inline-flex items-center gap-1.5 px-2 py-1 uppercase text-muted opacity-0 transition-colors hover:text-accent focus-visible:text-accent"
        >
          <ResetIcon />
          Reset
        </button>
      </div>
    </>
  );
}

function ResetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[10px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
