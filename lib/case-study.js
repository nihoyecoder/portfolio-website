// Helpers for case-study content files (data/case-studies/*.js).

// Marks a gap in the copy. Rendered with a highlight on the page so missing
// content is easy to spot; replace it with real copy when ready.
export const TODO = "[CONTENT TO ADD]";

// Export sizes for case-study images (WebP), by role.
export const IMAGE_SIZES = {
  wide: [2400, 1350], // hero and full-width compositions (16:9)
  banner: [2400, 1200], // shorter full-width strips (2:1)
  panel: [1600, 1200], // two-up / three-up panels (4:3)
  screen: [1600, 1000], // desktop or CMS screens (16:10)
  phone: [1170, 2532], // mobile screens, no device frame (390 × 844 @3x)
};

// One image slot. Until a file exists at `src`, the page shows a placeholder
// with the same proportions, the label and the expected size. In a
// "sequence", `title` and `caption` describe the step under the screen.
// `quality: 90` serves a crisper (heavier) file for detailed product shots.
export function image(src, { size = "wide", alt = "", label = "", title, caption, quality } = {}) {
  const [width, height] = IMAGE_SIZES[size];
  return { src, alt, label, title, caption, width, height, quality };
}
