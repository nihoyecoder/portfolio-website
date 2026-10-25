"use client";

import { gsap, media, useGSAP } from "@/lib/gsap";
import {
  FRAME,
  REST,
  REST_PATH,
  anchorBounds,
  buildPath,
  outerLimits,
  soften,
  unsoften,
} from "./portraitShape";

// Interaction tuning, in CSS pixels / seconds.
const GRAB_RADIUS = 12; // how close to an anchor a press has to land
const NEAR = 32; // how close the cursor comes before the editor appears
const CAPTION_CLEARANCE = 9; // deepest a pulled-down edge may go (caption starts 12px below)
const HINT_DELAY = 0.35; // time resting inside the portrait before the hint plays

// Makes the portrait's clip path editable like a vector in a design tool:
// hover to reveal the outline and anchors, drag an anchor to reshape, double-
// click (or press Reset) to restore.
//
// Only on wide screens with a mouse/trackpad, without reduced motion, and only
// once HeroMotion has finished the intro. Everything runs on refs: a pointer
// move just records the position and one animation frame writes the path —
// React never re-renders while editing.
export default function useEditableMask(refs) {
  useGSAP(() => {
    // HeroMotion zooms the photo in around its centre; SVG elements otherwise
    // transform around their top-left corner.
    gsap.set(refs.image.current, { transformOrigin: "50% 50%" });

    const mm = gsap.matchMedia();
    mm.add(media.edit, () => createEditor(refs));
    return () => mm.revert();
  });
}

function createEditor(refs) {
  const frame = refs.frame.current;
  const overlay = refs.overlay.current;
  const mask = refs.mask.current;
  const outline = refs.outline.current;
  const hint = refs.hint.current;
  const reset = refs.reset.current;
  const handles = [...overlay.querySelectorAll("[data-handle]")];
  const sizers = handles.map((handle) => handle.firstElementChild);
  const dots = handles.map((handle) => handle.querySelector("circle"));
  const hero = frame.closest("[data-hero]");
  const captionParts = [...(frame.closest("figure")?.querySelectorAll("figcaption > span") ?? [])];
  const html = document.documentElement;
  const probe = overlay.createSVGPoint();

  const points = REST.map((p) => ({ ...p }));
  let unitsPerPx = 1;
  let outer = outerLimits();
  let enabled = false;
  let onScreen = true;
  let visible = false;
  let hovered = -1;
  let selected = -1;
  let modified = false;
  let drag = null;
  let pointer = null; // last cursor position, client px
  let frameRequest = 0;
  let hintPlayed = false;
  let hasDragged = false;
  let hintTimer = null;
  let hintTimeline = null;
  let settleTimeline = null;
  let resetTween = null;

  // ---- Geometry ----------------------------------------------------------

  // Client px → SVG units. Uses the live CTM, so it holds at any size, scroll
  // position or drift offset.
  const toLocal = (x, y) => {
    const ctm = overlay.getScreenCTM();
    if (!ctm || !ctm.a) return null;
    const scale = 1 / ctm.a;
    if (Math.abs(scale - unitsPerPx) > unitsPerPx * 0.001) {
      unitsPerPx = scale;
      outer = outerLimits(FRAME.h + CAPTION_CLEARANCE * scale);
      // Anchors stay the same size on screen whatever the portrait's size.
      sizers.forEach((sizer) => sizer.setAttribute("transform", `scale(${scale})`));
    }
    const m = ctm.inverse();
    return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
  };

  const anchorAt = (local) => {
    let index = -1;
    let best = GRAB_RADIUS * unitsPerPx;
    points.forEach((p, i) => {
      const distance = Math.hypot(p.x - local.x, p.y - local.y);
      if (distance <= best) {
        best = distance;
        index = i;
      }
    });
    return index;
  };

  const isNear = (local) => {
    const pad = NEAR * unitsPerPx;
    let minX = 0;
    let minY = 0;
    let maxX = FRAME.w;
    let maxY = FRAME.h;
    for (const p of points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    return local.x > minX - pad && local.x < maxX + pad && local.y > minY - pad && local.y < maxY + pad;
  };

  const isInside = (local) => {
    probe.x = local.x;
    probe.y = local.y;
    return outline.isPointInFill(probe);
  };

  const isOnPortrait = (local) => isInside(local) || anchorAt(local) >= 0;

  // ---- Rendering ---------------------------------------------------------

  const render = () => {
    const d = buildPath(points, outer);
    mask.setAttribute("d", d);
    outline.setAttribute("d", d);
    points.forEach((p, i) => handles[i].setAttribute("transform", `translate(${p.x} ${p.y})`));
  };

  const schedule = () => {
    frameRequest ||= requestAnimationFrame(update);
  };

  const update = () => {
    frameRequest = 0;
    if (!pointer) return;
    if (drag) moveAnchor();
    else updateHover();
  };

  // ---- Editor visibility -------------------------------------------------

  const dotScale = (i) => (i === hovered || i === drag?.index ? 1.3 : 1);

  const setVisible = (value) => {
    if (value === visible) return;
    visible = value;
    gsap.to(outline, {
      opacity: value ? 0.6 : 0,
      duration: value ? 0.3 : 0.25,
      ease: "power2.out",
      overwrite: true,
    });
    // The anchors stay on screen all the time (see enable); hovering only
    // adds the outline and lets the hovered anchor grow.
    gsap.to(dots, {
      scale: (i) => (value ? dotScale(i) : 1),
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
    if (!value) select(-1);
  };

  const setHovered = (index) => {
    if (index === hovered) return;
    const previous = hovered;
    hovered = index;
    if (!drag) html.style.cursor = index >= 0 ? "grab" : "";
    for (const i of [previous, index]) {
      if (i >= 0) gsap.to(dots[i], { scale: dotScale(i), duration: 0.2, ease: "power2.out", overwrite: "auto" });
    }
  };

  // The last anchor touched stays filled, like a selection in a design tool.
  const select = (index) => {
    if (index === selected) return;
    dots[selected]?.removeAttribute("data-active");
    selected = index;
    dots[index]?.setAttribute("data-active", "");
  };

  // The listeners are window-wide, so check that nothing (e.g. Selected Work
  // sliding over the pinned hero) covers the portrait at this point.
  const reachable = (x, y) => {
    const top = document.elementFromPoint(x, y);
    return !top || !hero || hero.contains(top);
  };

  const updateHover = () => {
    const local = onScreen && reachable(pointer.x, pointer.y) ? toLocal(pointer.x, pointer.y) : null;
    const index = local ? anchorAt(local) : -1;
    setVisible(Boolean(local) && (index >= 0 || isNear(local)));
    setHovered(visible ? index : -1);

    // The hint plays once, after the cursor has rested inside the portrait.
    const inside = visible && isInside(local);
    if (inside && !hintPlayed && !hasDragged) {
      hintTimer ??= gsap.delayedCall(HINT_DELAY, playHint);
    } else if (!inside && hintTimer) {
      hintTimer.kill();
      hintTimer = null;
    }
  };

  // ---- Hint: swaps into the caption row for a moment ---------------------

  const playHint = () => {
    hintTimer = null;
    if (hintPlayed || hasDragged) return;
    hintPlayed = true;
    hintTimeline = gsap
      .timeline({ onComplete: () => (hintTimeline = null) })
      .to(captionParts, { opacity: 0, duration: 0.25, ease: "power2.out" })
      .fromTo(hint, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.1)
      .to(hint, { autoAlpha: 0, y: -2, duration: 0.3, ease: "power2.in" }, "+=2.2")
      .to(captionParts, { opacity: 1, duration: 0.35, ease: "power2.out" }, "<0.15");
  };

  const dismissHint = () => {
    hintTimer?.kill();
    hintTimer = null;
    if (!hintTimeline) return;
    hintTimeline.kill();
    hintTimeline = null;
    gsap.to(hint, { autoAlpha: 0, duration: 0.2, overwrite: true });
    gsap.to(captionParts, { opacity: 1, duration: 0.25, overwrite: true });
  };

  // ---- Dragging ----------------------------------------------------------

  const onPointerDown = (event) => {
    if (!visible || drag || event.button !== 0 || event.pointerType === "touch") return;
    if (!reachable(event.clientX, event.clientY)) return;
    const local = toLocal(event.clientX, event.clientY);
    const index = local ? anchorAt(local) : -1;
    if (index < 0) return;
    event.preventDefault();

    settleTimeline?.progress(1);
    resetTween?.kill();
    resetTween = null;
    dismissHint();
    hasDragged = true;

    const p = points[index];
    const rest = REST[index];
    const bounds = anchorBounds(index, outer);
    drag = {
      index,
      bounds,
      pointerId: event.pointerId,
      // Measured in un-softened space so the anchor doesn't jump on the first move.
      dx: unsoften(p.x, bounds.minX, bounds.maxX, rest.x) - local.x,
      dy: unsoften(p.y, bounds.minY, bounds.maxY, rest.y) - local.y,
      startX: p.x,
      startY: p.y,
      vx: 0,
      vy: 0,
      time: performance.now(),
    };
    pointer = { x: event.clientX, y: event.clientY };

    // Pauses HeroMotion's cursor drift so the anchor stays under the cursor.
    hero?.dispatchEvent(new Event("portrait:editstart"));
    try {
      frame.setPointerCapture(event.pointerId);
    } catch {
      // The pointer is already gone; pointerup/cancel will end the drag.
    }
    html.style.cursor = "grabbing";
    html.style.userSelect = "none";
    html.style.webkitUserSelect = "none";
    window.getSelection()?.removeAllRanges();
    select(index);
    gsap.to(dots[index], { scale: 1.3, duration: 0.2, ease: "power2.out", overwrite: "auto" });
  };

  const moveAnchor = () => {
    const local = toLocal(pointer.x, pointer.y);
    if (!local) return;
    const { index, bounds } = drag;
    const rest = REST[index];
    const p = points[index];
    const x = soften(local.x + drag.dx, bounds.minX, bounds.maxX, rest.x);
    const y = soften(local.y + drag.dy, bounds.minY, bounds.maxY, rest.y);
    if (x === p.x && y === p.y) return;
    // Velocity of the latest movement, for the release settle.
    const now = performance.now();
    const elapsed = Math.max(1, now - drag.time);
    drag.vx = (x - p.x) / elapsed;
    drag.vy = (y - p.y) / elapsed;
    drag.time = now;
    p.x = x;
    p.y = y;
    render();
  };

  const onPointerEnd = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (frameRequest) {
      cancelAnimationFrame(frameRequest);
      frameRequest = 0;
    }
    if (event.type === "pointerup") {
      pointer = { x: event.clientX, y: event.clientY };
      moveAnchor();
    }
    const ended = drag;
    drag = null;
    if (frame.hasPointerCapture(ended.pointerId)) frame.releasePointerCapture(ended.pointerId);
    html.style.cursor = "";
    html.style.userSelect = "";
    html.style.webkitUserSelect = "";
    hero?.dispatchEvent(new Event("portrait:editend"));

    settle(ended);
    updateModified();

    // Re-read the hover state where the pointer ended up — it may be outside.
    hovered = -1;
    if (pointer) updateHover();
    if (visible) {
      gsap.to(dots[ended.index], { scale: dotScale(ended.index), duration: 0.35, ease: "power3.out", overwrite: "auto" });
    }
  };

  // A released anchor carries on 2–4px in the direction it was travelling,
  // then eases back to where it was let go.
  const settle = ({ index, startX, startY, vx, vy, time }) => {
    const p = points[index];
    const moving = performance.now() - time < 80;
    let dx = moving ? vx : 0;
    let dy = moving ? vy : 0;
    const speed = (Math.hypot(dx, dy) * 16) / unitsPerPx; // px per frame
    if (speed < 0.5) {
      dx = p.x - startX;
      dy = p.y - startY;
    }
    const length = Math.hypot(dx, dy);
    if (length < 0.01) return;

    const reach = gsap.utils.clamp(2, 4, 2 + speed * 0.25) * unitsPerPx;
    const { minX, maxX, minY, maxY } = anchorBounds(index, outer);
    const x = p.x;
    const y = p.y;
    settleTimeline = gsap
      .timeline({ onUpdate: render, onComplete: () => (settleTimeline = null) })
      .to(p, {
        x: gsap.utils.clamp(minX, maxX, x + (dx / length) * reach),
        y: gsap.utils.clamp(minY, maxY, y + (dy / length) * reach),
        duration: 0.14,
        ease: "power2.out",
      })
      .to(p, { x, y, duration: 0.6, ease: "power3.out" });
  };

  // ---- Reset -------------------------------------------------------------

  const updateModified = () => {
    const value = points.some((p, i) => Math.hypot(p.x - REST[i].x, p.y - REST[i].y) > 0.5);
    if (value === modified) return;
    modified = value;
    gsap.to(reset, {
      autoAlpha: value ? 1 : 0,
      duration: value ? 0.35 : 0.25,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const resetShape = () => {
    if (drag) return;
    settleTimeline?.kill();
    settleTimeline = null;
    resetTween?.kill();
    const from = points.map((p) => ({ ...p }));
    const progress = { t: 0 };
    resetTween = gsap.to(progress, {
      t: 1,
      duration: 0.8,
      ease: "power3.inOut",
      onUpdate: () => {
        points.forEach((p, i) => {
          p.x = from[i].x + (REST[i].x - from[i].x) * progress.t;
          p.y = from[i].y + (REST[i].y - from[i].y) * progress.t;
        });
        render();
      },
      onComplete: () => (resetTween = null),
    });
    select(-1);
    modified = false;
    gsap.to(reset, { autoAlpha: 0, duration: 0.25, ease: "power2.out", overwrite: true });
  };

  const onDoubleClick = (event) => {
    if (!visible) return;
    const local = toLocal(event.clientX, event.clientY);
    if (local && isOnPortrait(local)) resetShape();
  };

  // Stops a double-click on the portrait from selecting a word of the
  // statement, which overlaps its left edge at some widths.
  const onMouseDown = (event) => {
    if (event.detail < 2 || !visible) return;
    const local = toLocal(event.clientX, event.clientY);
    if (local && isOnPortrait(local)) event.preventDefault();
  };

  // ---- Pointer tracking --------------------------------------------------

  const onPointerMove = (event) => {
    if (event.pointerType === "touch") return;
    if (drag && event.pointerId !== drag.pointerId) return;
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
  };

  // Keeps the anchors' on-screen size right without waiting for a pointer move.
  const syncScale = () => toLocal(0, 0);

  const onScroll = () => {
    if (pointer) schedule();
  };

  const onLeave = () => {
    if (drag) return;
    pointer = null;
    hintTimer?.kill();
    hintTimer = null;
    setHovered(-1);
    setVisible(false);
  };

  const onBlur = () => {
    if (drag) onPointerEnd({ type: "pointercancel", pointerId: drag.pointerId });
    onLeave();
  };

  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (!onScreen) onLeave();
  });

  // ---- Lifecycle ---------------------------------------------------------

  const listeners = [
    [window, "pointermove", onPointerMove, { passive: true }],
    [window, "pointerdown", onPointerDown, { capture: true }],
    [window, "pointerup", onPointerEnd, { capture: true }],
    [window, "pointercancel", onPointerEnd, { capture: true }],
    [window, "mousedown", onMouseDown, { capture: true }],
    [window, "dblclick", onDoubleClick],
    [window, "scroll", onScroll, { passive: true }],
    [window, "blur", onBlur],
    [window, "resize", syncScale],
    [html, "pointerleave", onLeave],
    [frame, "lostpointercapture", onPointerEnd],
    [reset, "click", resetShape],
  ];

  const enable = () => {
    if (enabled) return;
    enabled = true;
    // The intro leaves `clip-path: inset(0%)` on the frame, which would cut
    // off any edge pulled outward.
    frame.style.clipPath = "";
    gsap.set(outline, { opacity: 0 });
    // The anchors fade in once the intro has settled and then stay visible,
    // hinting that the portrait can be reshaped.
    syncScale();
    gsap.set(dots, { transformOrigin: "50% 50%", scale: 0.7, opacity: 0 });
    gsap.to(dots, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", stagger: 0.04 });
    observer.observe(frame);
    listeners.forEach(([target, type, fn, options]) => target.addEventListener(type, fn, options));
  };

  // Wait for the entrance animation to settle before the portrait becomes editable.
  if (!hero || hero.hasAttribute("data-intro-done")) enable();
  else hero.addEventListener("hero:introdone", enable, { once: true });

  return () => {
    hero?.removeEventListener("hero:introdone", enable);
    if (!enabled) return;
    observer.disconnect();
    listeners.forEach(([target, type, fn, options]) => target.removeEventListener(type, fn, options));
    cancelAnimationFrame(frameRequest);
    if (drag) {
      if (frame.hasPointerCapture(drag.pointerId)) frame.releasePointerCapture(drag.pointerId);
      drag = null;
      hero?.dispatchEvent(new Event("portrait:editend"));
    }
    hintTimer?.kill();
    hintTimeline?.kill();
    settleTimeline?.kill();
    resetTween?.kill();

    // Back to the plain portrait.
    const decorations = [outline, hint, reset, ...dots, ...captionParts];
    gsap.killTweensOf(decorations);
    gsap.set(decorations, { clearProps: "all" });
    dots.forEach((dot) => dot.removeAttribute("data-active"));
    mask.setAttribute("d", REST_PATH);
    outline.setAttribute("d", REST_PATH);
    handles.forEach((handle, i) => handle.setAttribute("transform", `translate(${REST[i].x} ${REST[i].y})`));
    html.style.cursor = "";
    html.style.userSelect = "";
    html.style.webkitUserSelect = "";
  };
}
