// Geometry for the hero's editable portrait mask. Pure functions, shared by
// the server render (the resting path) and the client editor.
//
// Everything is in SVG user units. The frame — the portrait's 3:4 box — is
// 900 × 1200 with its origin at the top-left corner, so coordinates scale
// with the portrait at every viewport width.

export const FRAME = { w: 900, h: 1200 };
const { w: W, h: H } = FRAME;

// The photo extends past the frame on every side, so a boundary pulled
// outward still reveals photo rather than page. Vertically that costs a 4%
// zoom (1248 / 1200); sideways the photo's wider-than-3:4 aspect already
// provides the room.
const BLEED = { x: 72, y: 24 };

// The area both SVGs (and the photo) cover: in units, and as CSS offsets
// relative to the frame.
export const BOX = { x: -BLEED.x, y: -BLEED.y, w: W + 2 * BLEED.x, h: H + 2 * BLEED.y };
export const VIEWBOX = `${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`;

const percent = (value) => `${Math.round(value * 1e4) / 100}%`;
export const BOX_STYLE = {
  left: percent(BOX.x / W),
  top: percent(BOX.y / H),
  width: percent(BOX.w / W),
  height: percent(BOX.h / H),
};

// Eight anchors, clockwise from the top-left corner. Even indices are corners.
export const REST = [
  { x: 0, y: 0 },
  { x: W / 2, y: 0 },
  { x: W, y: 0 },
  { x: W, y: H / 2 },
  { x: W, y: H },
  { x: W / 2, y: H },
  { x: 0, y: H },
  { x: 0, y: H / 2 },
];

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

// How far an anchor may travel into the frame, and how far an edge midpoint
// may slide along its edge (≈ 60–100px at common desktop sizes).
const PULL = { x: 0.22 * W, y: 0.2 * H };
const SLIDE = { x: 0.17 * W, y: 0.17 * H };

// The furthest any point — anchor or curve handle — may sit outside the
// frame: just inside the photo's edge. `bottom` can be tightened further
// (the caption sits under the portrait).
export function outerLimits(bottom = Infinity) {
  const edge = 2;
  return {
    left: BOX.x + edge,
    right: BOX.x + BOX.w - edge,
    top: BOX.y + edge,
    bottom: Math.min(BOX.y + BOX.h - edge, bottom),
  };
}

// Each anchor gets its own box. The boxes never overlap, so the shape can't
// cross itself, invert or collapse.
export function anchorBounds(index, outer) {
  const { x, y } = REST[index];
  const [minX, maxX] =
    x === 0 ? [outer.left, PULL.x] : x === W ? [W - PULL.x, outer.right] : [x - SLIDE.x, x + SLIDE.x];
  const [minY, maxY] =
    y === 0 ? [outer.top, PULL.y] : y === H ? [H - PULL.y, outer.bottom] : [y - SLIDE.y, y + SLIDE.y];
  return { minX, maxX, minY, maxY };
}

// Near a limit an anchor eases in rather than stopping dead: within SOFT
// units of it (never reaching back past the resting position) the pointer's
// travel is compressed, so the anchor approaches the limit but never passes.
const SOFT = 36;

function softZones(min, max, rest) {
  const low = Math.min(SOFT, rest - min);
  const high = Math.min(SOFT, max - rest);
  return { low, high, a: min + low, b: max - high };
}

export function soften(value, min, max, rest) {
  const { low, high, a, b } = softZones(min, max, rest);
  if (value > b) return high > 0 ? b + high * (1 - Math.exp((b - value) / high)) : b;
  if (value < a) return low > 0 ? a - low * (1 - Math.exp((value - a) / low)) : a;
  return value;
}

// Inverse of soften(), so a drag can pick up an anchor already sitting in a
// soft zone without it jumping.
export function unsoften(value, min, max, rest) {
  const { low, high, a, b } = softZones(min, max, rest);
  if (value > b && high > 0) return b - high * Math.log(1 - Math.min((value - b) / high, 0.999));
  if (value < a && low > 0) return a + low * Math.log(1 - Math.min((a - value) / low, 0.999));
  return value;
}

// ---------------------------------------------------------------------------
// Path
// ---------------------------------------------------------------------------

const RADIUS = 8; // corner rounding at rest — the old 3px radius
const SMOOTH_AT = 120; // a corner dragged this far has become a fully smooth point

const round = (n) => Math.round(n * 100) / 100;
const clamp = (value, min, max) => (value < min ? min : value > max ? max : value);

// A closed path through the anchors, one cubic Bézier per edge. Each anchor's
// tangent runs parallel to the line between its neighbours (Catmull-Rom), and
// each handle is a third of the edge it sits on, so unevenly spaced anchors
// can't loop or overshoot. Edge midpoints are always smooth. Corners start
// sharp (with a small fillet) and blend to smooth as they leave their resting
// position, so at rest the path is exactly the rectangular frame and a pulled
// edge bows instead of kinking. Handles are kept inside `outer`, which keeps
// the whole curve on the photo.
export function buildPath(points, outer) {
  const n = points.length;
  const handleIn = [];
  const handleOut = [];
  const fillet = [];

  for (let i = 0; i < n; i++) {
    const p = points[i];
    const prev = points[(i + n - 1) % n];
    const next = points[(i + 1) % n];
    let smooth = 1;
    if (i % 2 === 0) {
      const t = Math.min(1, Math.hypot(p.x - REST[i].x, p.y - REST[i].y) / SMOOTH_AT);
      smooth = t * t * (3 - 2 * t);
      fillet[i] = RADIUS * (1 - smooth);
    } else {
      fillet[i] = 0;
    }
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const k = smooth / (3 * (Math.hypot(dx, dy) || 1));
    const before = Math.hypot(p.x - prev.x, p.y - prev.y) * k;
    const after = Math.hypot(next.x - p.x, next.y - p.y) * k;
    handleIn[i] = { x: dx * before, y: dy * before };
    handleOut[i] = { x: dx * after, y: dy * after };
  }

  const cx = (x) => clamp(x, outer.left, outer.right);
  const cy = (y) => clamp(y, outer.top, outer.bottom);

  // One cubic per edge: [x0, y0, x1, y1, x2, y2, x3, y3].
  const seg = points.map((p, i) => {
    const j = (i + 1) % n;
    const q = points[j];
    return [
      p.x,
      p.y,
      cx(p.x + handleOut[i].x),
      cy(p.y + handleOut[i].y),
      cx(q.x - handleIn[j].x),
      cy(q.y - handleIn[j].y),
      q.x,
      q.y,
    ];
  });

  // Round the corners: pull both neighbouring segments back from the corner
  // along their tangents, then bridge the gap with a quadratic through it.
  for (let i = 0; i < n; i++) {
    const r = fillet[i];
    if (r < 0.01) continue;
    const before = seg[(i + n - 1) % n];
    const after = seg[i];
    const back = towards(before[6], before[7], [before[4], before[5], before[2], before[3], before[0], before[1]]);
    const ahead = towards(after[0], after[1], [after[2], after[3], after[4], after[5], after[6], after[7]]);
    before[6] = cx(before[6] + back.x * r);
    before[7] = cy(before[7] + back.y * r);
    before[4] = cx(before[4] + back.x * r);
    before[5] = cy(before[5] + back.y * r);
    after[0] = cx(after[0] + ahead.x * r);
    after[1] = cy(after[1] + ahead.y * r);
    after[2] = cx(after[2] + ahead.x * r);
    after[3] = cy(after[3] + ahead.y * r);
  }

  let d = `M${round(seg[0][0])} ${round(seg[0][1])}`;
  for (let i = 0; i < n; i++) {
    const s = seg[i];
    const j = (i + 1) % n;
    d += `C${round(s[2])} ${round(s[3])} ${round(s[4])} ${round(s[5])} ${round(s[6])} ${round(s[7])}`;
    if (fillet[j] >= 0.01) {
      d += `Q${round(points[j].x)} ${round(points[j].y)} ${round(seg[j][0])} ${round(seg[j][1])}`;
    }
  }
  return `${d}Z`;
}

// Unit vector from (x, y) to the first point in `candidates` (flat x, y
// pairs) that isn't on top of it.
function towards(x, y, candidates) {
  for (let k = 0; k < candidates.length; k += 2) {
    const dx = candidates[k] - x;
    const dy = candidates[k + 1] - y;
    const length = Math.hypot(dx, dy);
    if (length > 1e-6) return { x: dx / length, y: dy / length };
  }
  return { x: 0, y: 0 };
}

export const REST_PATH = buildPath(REST, outerLimits());
