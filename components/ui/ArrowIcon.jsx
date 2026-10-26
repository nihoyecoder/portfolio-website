// The site's two link arrows, drawn to match the supplied icons: bold
// strokes with square ends. They take the text colour (currentColor) and sit
// at text size, so they follow hover colours like a glyph would.
//   up-right  links that take you elsewhere (other pages, new tabs)
//   down      downloads
const PATHS = {
  "up-right": "M7 5H19V17M19 5 5 19",
  down: "M12 3V20M4 12l8 8 8-8",
};

export default function ArrowIcon({ direction = "up-right", className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`inline-block size-[0.85em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    >
      <path d={PATHS[direction]} />
    </svg>
  );
}
