"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Preloader.module.css";

// "Wireframe → interface": the loading moment as the page being designed.
// On a Figma-style canvas a cursor tagged "Manoj" drags out a frame at the
// visitor's screen size, sketches the hero as grey blocks (with smart guides
// and redlines), colours them in, then zooms the frame to fill the screen.
// Every block is measured from the real hero, so it lands exactly on the real
// element, and the hero's own intro (HeroMotion) takes over from there. The
// zoom readout hits 100% as the frame zooms to 100%. All in about 1.2s.
//
// The first full load of the home page per session only, and a click or any
// key skips it. Never on /work/* (it lives on the home page). Skipped for
// #anchor links, back/forward visits, reduced motion and no JavaScript.

// Runs while the HTML is parsed, before the first paint, on full loads only
// (on the client it's rendered as an inert text/plain block, so client-side
// navigations never run it). Marks the load, skips the preloader where it
// shouldn't play (already seen this session, an #anchor, back/forward,
// reduced motion), and stops the browser restoring an old scroll position
// underneath it.
const SEEN = "preloader-seen"; // sessionStorage: it plays once per session
const SCRIPT = `(function(){try{window.__preloader=1;var p=document.getElementById("preloader"),n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0],s;try{s=sessionStorage.getItem("${SEEN}")}catch(e){}if(s||location.hash||(n&&n.type==="back_forward")||matchMedia("(prefers-reduced-motion: reduce)").matches){p.setAttribute("data-skip","");return}if("scrollRestoration" in history)history.scrollRestoration="manual"}catch(e){}})()`;

// By now (ms since the navigation) the CSS fallback in Preloader.module.css is
// about to hide the overlay; hydrating any later skips the preloader.
const LATE = 3000;

const STAGES = ["Wireframe", "Design", "Build"];

const TOOLS = [
  { id: "move", d: "M6.5 4 18 10.2l-5.4 1.6-2.3 5.2z" },
  { id: "frame", d: "M8.5 4v16M15.5 4v16M4 8.5h16M4 15.5h16" },
  { id: "rect", d: "M5 6.5h14v11H5z" },
  { id: "pen", d: "M12 20 6.5 12 12 4l5.5 8zM12 12h.01M12 4v5.5" },
  { id: "text", d: "M6.5 7.5V5h11v2.5M12 5v14M9.5 19h5" },
];

// Corner and edge-midpoint handles, as % of the frame.
const HANDLES = [
  [0, 0],
  [50, 0],
  [100, 0],
  [100, 50],
  [100, 100],
  [50, 100],
  [0, 100],
  [0, 50],
];

const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);

// Timeline, in seconds: the whole story plays in about 1.2s.
const T = {
  frameFor: 0.22, // the frame is dragged out (from 0)
  blocks: 0.2, // small pieces pop in, top to bottom
  blocksFor: 0.2,
  majors: [0.28, 0.36, 0.44], // the name and the portrait are dragged out
  majorFor: 0.1,
  design: 0.56, // colour goes on
  build: 0.8, // the canvas clears and the frame zooms in
  zoomFor: 0.26,
};

export default function Preloader() {
  const ref = useRef(null);
  // Only a full page load arms it (the inline script marks it); rendered by a
  // client-side navigation back home, it stays switched off.
  const [armed] = useState(() => typeof window === "undefined" || window.__preloader === 1);

  useGSAP(
    (context, contextSafe) => {
      const root = ref.current;
      const html = document.documentElement;
      if (
        !armed ||
        root.hasAttribute("data-skip") ||
        performance.now() > LATE ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        root.setAttribute("data-skip", "");
        window.__preloader = 0;
        if ("scrollRestoration" in history) history.scrollRestoration = "auto";
        return;
      }

      // JS owns the overlay from here (the CSS fallback stands down), and
      // HeroMotion holds its intro until "preloader:reveal". The preloader
      // renders before the hero, so this runs before HeroMotion's setup.
      root.setAttribute("data-run", "");
      html.setAttribute("data-preloading", "");
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const q = gsap.utils.selector(root);
      const [wire] = q("[data-wire]");
      const [outline] = q("[data-outline]");
      const [dims] = q("[data-dims]");
      const [cursor] = q("[data-cursor]");
      const [swatch] = q("[data-swatch]");
      const [guide] = q("[data-guide]");
      const [measure] = q("[data-measure]");
      const [zoomText] = q("[data-zoom]");
      const handles = q("[data-handle]");
      const chrome = q("[data-chrome]");
      const stages = q("[data-stage]");
      const tools = q("[data-tool]");

      let cancelled = false;
      let tl = null;
      let revealed = false;
      let size = null; // the viewport the blocks were measured at

      // No scrolling the page underneath (without hiding the scrollbar,
      // which would shift the layout being measured).
      const block = (event) => event.preventDefault();
      const blockKeys = (event) => SCROLL_KEYS.has(event.key) && event.preventDefault();
      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });
      window.addEventListener("keydown", blockKeys);
      // A click, tap or any key skips straight to the page.
      const skip = () => {
        tl?.kill();
        finish();
      };
      window.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", skip);
      const unlock = () => {
        window.removeEventListener("wheel", block);
        window.removeEventListener("touchmove", block);
        window.removeEventListener("keydown", blockKeys);
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
      };

      // Hand over to the hero: the overlay turns see-through (the frame has
      // the page's own background) and the hero intro starts underneath.
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        root.setAttribute("data-revealing", "");
        html.removeAttribute("data-preloading");
        window.dispatchEvent(new Event("preloader:reveal"));
      };
      const finish = () => {
        reveal();
        root.setAttribute("data-done", "");
        unlock();
        window.removeEventListener("resize", onResize);
        window.__preloader = 0;
        if ("scrollRestoration" in history) history.scrollRestoration = "auto";
      };

      // The blocks are measured once; if the layout changes under them
      // (rotation, window resize — not a mobile toolbar), just hand over.
      const onResize = () => {
        if (!size) return;
        if (Math.abs(html.clientWidth - size.w) < 2 && Math.abs(html.clientHeight - size.h) < 160) return;
        tl?.kill();
        finish();
      };
      window.addEventListener("resize", onResize);

      const setActive = (list, value, key) =>
        list.forEach((el) => el.toggleAttribute("data-active", el.dataset[key] === value));
      const stage = (name) => setActive(stages, name, "stage");
      const tool = (name) => setActive(tools, name, "tool");

      const build = contextSafe(() => {
        if (cancelled) return;
        const vw = html.clientWidth;
        const vh = html.clientHeight;
        size = { w: vw, h: vh };
        const small = vw < 768;

        // The frame: the viewport scaled down to fit between the chrome.
        const s = Math.max(0.3, Math.min(small ? 0.84 : 0.58, (vh - (small ? 250 : 240)) / vh));
        const fw = vw * s;
        const fh = vh * s;
        const fx = (vw - fw) / 2;
        const fy = (vh - fh) / 2 - (small ? 8 : 14);
        const toScreen = (x, y) => ({ x: fx + x * s, y: fy + y * s });

        const blocks = measureHero();
        for (const b of blocks) {
          const el = document.createElement("span");
          el.className = styles.block;
          el.dataset.kind = b.kind;
          Object.assign(el.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` });
          if (b.kind === "name" || b.kind === "button") {
            b.fill = document.createElement("span");
            b.fill.className = styles.fill;
            el.append(b.fill);
          }
          if (b.kind === "image") el.innerHTML = CROSS;
          if (b.kind === "logo" && b.src) el.style.setProperty("--src", `url("${b.src}")`);
          wire.append(el);
          b.el = el;
        }
        // The header's own items drop in from above (HeroMotion); their blocks
        // clear out of the way quickly so the logo doesn't show twice.
        const headerEls = blocks.filter((b) => b.header).map((b) => b.el);
        const bodyEls = blocks.filter((b) => !b.header).map((b) => b.el);

        // Reading order: top to bottom, then left to right.
        const centre = (b) => b.y + b.h / 2;
        const majors = blocks
          .filter((b) => b.kind === "name" || b.kind === "image")
          .sort((a, b) => (Math.abs(centre(a) - centre(b)) < 4 ? a.x - b.x : centre(a) - centre(b)));
        const minors = blocks.filter((b) => !majors.includes(b)).sort((a, b) => a.y - b.y || a.x - b.x);
        // The name fills first (it's what gets clicked), then the button.
        const fills = [...majors, ...minors].filter((b) => b.fill).map((b) => b.fill);

        const accent = getComputedStyle(html).getPropertyValue("--accent").trim().replace("#", "").toUpperCase();
        if (accent) swatch.lastChild.textContent = accent;

        gsap.set(wire, { width: vw, height: vh, x: fx, y: fy, scale: s, transformOrigin: "0 0", autoAlpha: 1 });
        wire.style.clipPath = "inset(0% 100% 100% 0%)";
        gsap.set(outline, { x: fx, y: fy, width: 0, height: 0 });
        gsap.set(cursor, { x: fx, y: fy });
        gsap.set(handles, { scale: 0.4, autoAlpha: 0 });
        if (fills.length) gsap.set(fills, { scaleX: 0, transformOrigin: "0% 50%" });

        // Dragging the frame out: outline, clip, cursor and size together.
        const draw = { p: 0 };
        const renderDraw = () => {
          const w = fw * draw.p;
          const h = fh * draw.p;
          outline.style.width = `${w}px`;
          outline.style.height = `${h}px`;
          const cut = `${(1 - draw.p) * 100}%`;
          wire.style.clipPath = `inset(0% ${cut} ${cut} 0%)`;
          gsap.set(cursor, { x: fx + w, y: fy + h });
          dims.textContent = `${Math.round(window.innerWidth * draw.p)} × ${Math.round(window.innerHeight * draw.p)}`;
        };

        const zoom = { v: 0 };
        tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });

        // Progress: the readout reaches 100% as the frame zooms to 100%.
        tl.to(
          zoom,
          {
            v: 100,
            duration: T.build + T.zoomFor,
            ease: "power1.inOut",
            onUpdate: () => (zoomText.textContent = `${Math.round(zoom.v)}%`),
          },
          0,
        );

        // 1 · Wireframe. Draw the frame…
        tl.call(() => (stage("wireframe"), tool("frame")), null, 0)
          .to(cursor, { autoAlpha: 1, duration: 0.08 }, 0)
          .set(outline, { autoAlpha: 1 }, 0)
          .to(draw, { p: 1, duration: T.frameFor, ease: "power2.inOut", onUpdate: renderDraw }, 0)
          .to(handles, { scale: 1, autoAlpha: 1, duration: 0.12, stagger: 0.006 }, T.frameFor - 0.04)
          .to(dims, { autoAlpha: 0, duration: 0.1 }, T.majors[0])
          .call(() => tool("rect"), null, T.blocks);

        // …sketch the small pieces…
        const step = Math.min(0.012, T.blocksFor / Math.max(1, minors.length));
        minors.forEach((b, i) => {
          const text = b.kind === "text";
          tl.from(
            b.el,
            { scaleX: 0, scaleY: text ? 1 : 0.4, transformOrigin: text ? "0% 50%" : "50% 50%", duration: 0.14 },
            T.blocks + i * step,
          );
        });

        // …and drag out the big ones, snapping to guides as a designer would.
        majors.forEach((b, i) => {
          const start = T.majors[Math.min(i, T.majors.length - 1)] + Math.max(0, i - 2) * 0.06;
          const from = toScreen(b.x, b.y);
          const to = toScreen(b.x + b.w, b.y + b.h);
          tl.to(cursor, { x: from.x, y: from.y, duration: 0.06, ease: "power2.inOut" }, start - 0.06)
            .from(b.el, { scaleX: 0, scaleY: 0, transformOrigin: "0 0", duration: T.majorFor, ease: "power2.inOut" }, start)
            .to(cursor, { x: to.x, y: to.y, duration: T.majorFor, ease: "power2.inOut" }, start);
          snap(tl, b, start, { vw, fy, fh, s, toScreen, guide, measure });
        });

        // 2 · Design. Pick the accent, click, and the colour sweeps in.
        const target = majors.find((b) => b.kind === "name") ?? majors[0];
        tl.call(() => (stage("design"), tool("move")), null, T.design);
        if (target) {
          const point = toScreen(target.x + target.w * 0.22, target.y + target.h * 0.6);
          tl.to(cursor, { x: point.x, y: point.y, duration: 0.1, ease: "power2.inOut" }, T.design);
        }
        tl.to(swatch, { autoAlpha: 1, y: 0, duration: 0.1 }, T.design + 0.04)
          .to(cursor, { scale: 0.86, duration: 0.05, ease: "power2.in" }, T.design + 0.08)
          .to(cursor, { scale: 1, duration: 0.1 }, T.design + 0.13)
          .call(() => wire.setAttribute("data-designed", ""), null, T.design + 0.1);
        if (fills.length) tl.to(fills, { scaleX: 1, duration: 0.18, ease: "power3.inOut", stagger: 0.03 }, T.design + 0.1);

        // 3 · Build. The canvas clears and the frame zooms to fill the
        // screen, landing every block on its real element; the hero takes over.
        const landed = T.build + T.zoomFor;
        tl.call(() => stage("build"), null, T.build)
          .to([...chrome, outline, cursor], { autoAlpha: 0, duration: 0.12, ease: "power2.out" }, T.build)
          .to(wire, { x: 0, y: 0, scale: 1, duration: T.zoomFor, ease: "expo.inOut" }, T.build)
          .call(reveal, null, landed);
        if (headerEls.length) tl.to(headerEls, { autoAlpha: 0, duration: 0.08, ease: "none" }, landed);
        if (bodyEls.length) tl.to(bodyEls, { autoAlpha: 0, duration: 0.14, ease: "power2.out" }, landed);
      });

      const fonts = document.fonts?.ready ?? Promise.resolve();
      // Start once the fonts are in (so the measurements are final), or soon
      // anyway; the hero's own intro shows the portrait arriving.
      Promise.race([fonts, wait(300)]).then(() => {
        try {
          build();
        } catch (error) {
          tl?.kill();
          finish();
          throw error;
        }
      });

      return () => {
        cancelled = true;
        tl?.kill();
        unlock();
        window.removeEventListener("resize", onResize);
        window.__preloader = 0;
        html.removeAttribute("data-preloading");
        for (const name of ["data-run", "data-revealing", "data-done"]) root.removeAttribute(name);
        wire.removeAttribute("data-designed");
        wire.replaceChildren();
        wire.style.clipPath = "";
      };
    },
    { scope: ref },
  );

  return (
    <>
      <div
        ref={ref}
        id="preloader"
        data-state={armed ? "on" : "off"}
        aria-hidden="true"
        className={styles.root}
        suppressHydrationWarning
      >
        <div data-chrome className={styles.grid} />
        <div data-chrome className={styles.top}>
          <div className={styles.topInner}>
            <p className={styles.file}>
              <span className={styles.avatar}>M</span>
              <span className={styles.owner}>Manoj Rawat</span>
              <span className={styles.sep}>/</span>
              <span className={styles.fileName}>Portfolio</span>
            </p>
            <ol className={styles.stages}>
              {STAGES.map((name, i) => (
                <li key={name} data-stage={name.toLowerCase()} data-active={i === 0 || undefined}>
                  {name}
                </li>
              ))}
            </ol>
            <p className={styles.zoom}>
              <span data-zoom>0%</span>
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="m3 4.5 3 3 3-3" />
              </svg>
            </p>
          </div>
        </div>

        {/* The frame's contents: a viewport-sized copy of the hero as blocks. */}
        <div data-wire className={styles.wire} />

        {/* Smart guide and redline, shown while a block is dragged out. */}
        <span data-guide className={styles.guide} />
        <span data-measure className={styles.measure}>
          <span />
        </span>

        {/* Selection: outline, name, handles and the live size. */}
        <div data-outline className={styles.outline}>
          <span className={styles.frameLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.5 4v16M15.5 4v16M4 8.5h16M4 15.5h16" />
            </svg>
            Home
          </span>
          {HANDLES.map(([x, y]) => (
            <span key={`${x}-${y}`} data-handle className={styles.handle} style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
          <span data-dims className={styles.dims}>
            0 × 0
          </span>
        </div>

        {/* A multiplayer-style cursor, as in a shared design file. */}
        <div data-cursor className={styles.cursor}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 2.5 16.5 9l-6 1.8-2.6 6.2z" />
          </svg>
          <span className={styles.tag}>Manoj</span>
          <span data-swatch className={styles.swatch}>
            <i />
            C4546A
          </span>
        </div>

        <div data-chrome className={styles.toolbar}>
          <div className={styles.toolbarInner}>
            {TOOLS.map((t) => (
              <span key={t.id} data-tool={t.id} data-active={t.id === "frame" || undefined} className={styles.tool}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={t.d} />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
      <noscript>
        <style>{"#preloader{display:none!important}"}</style>
      </noscript>
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: SCRIPT }}
      />
    </>
  );
}

const CROSS =
  '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 100 100M100 0 0 100" vector-effect="non-scaling-stroke"/></svg>';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// While a big block is dragged out: a smart guide through the edge it lines
// up on (or its centre) and, against the page margin, a redline with the gap.
function snap(tl, b, start, { vw, fy, fh, s, toScreen, guide, measure }) {
  const left = b.x < vw * 0.2;
  const right = !left && b.x + b.w > vw * 0.8;
  const edge = left ? b.x : right ? b.x + b.w : b.x + b.w / 2;
  const mid = toScreen(edge, b.y + b.h / 2);
  const end = start + T.majorFor + 0.06;

  tl.set(guide, { x: mid.x, y: fy, height: fh, autoAlpha: 1 }, start).set(guide, { autoAlpha: 0 }, end);
  if (!left && !right) return;

  const gap = left ? b.x : vw - (b.x + b.w);
  tl.set(measure, { x: left ? toScreen(0, 0).x : mid.x, y: mid.y, width: gap * s, autoAlpha: 1 }, start)
    .call(() => (measure.firstChild.textContent = Math.round(gap)), null, start)
    .set(measure, { autoAlpha: 0 }, end);
}

// ---------------------------------------------------------------------------
// The hero, as blocks: viewport coordinates of the real elements. Offsets
// from the intro's start states (GSAP `y`) are taken out, so the blocks sit
// where things end up.
// ---------------------------------------------------------------------------

function measureHero() {
  const blocks = [];
  const shown = (el) => el && el.getClientRects().length > 0;
  const lift = (el) => Number(gsap.getProperty(el, "y")) || 0;
  const add = (kind, rect, dy = 0, extra) => {
    if (!rect || rect.width < 2 || rect.height < 2) return;
    blocks.push({ kind, x: rect.left, y: rect.top - dy, w: rect.width, h: rect.height, ...extra });
  };
  // A line of text becomes a rounded bar about as tall as its lowercase letters.
  const bar = (rect, dy = 0) => {
    if (!rect || rect.width < 2) return;
    const h = Math.max(3, rect.height * 0.4);
    add("text", { left: rect.left, top: rect.top + (rect.height - h) / 2 + rect.height * 0.05, width: rect.width, height: h }, dy);
  };

  // Header: logo, links (or Menu), "Let's talk".
  for (const el of document.querySelectorAll('[data-site-header] [data-anim="nav"]')) {
    if (!shown(el)) continue;
    const dy = lift(el);
    const logo = el.matches('a[href="/"]') ? el.querySelector("img") : null;
    if (logo) add("logo", logo.getBoundingClientRect(), dy, { src: logo.currentSrc || logo.src });
    else if (hasFill(el)) add("button", el.getBoundingClientRect(), dy);
    else bar(contentBox(el), dy);
  }
  for (const b of blocks) b.header = true;

  const hero = document.querySelector("[data-hero]");
  if (!hero) return blocks;

  for (const el of hero.querySelectorAll('[data-anim="meta"]')) if (shown(el)) lines(el).forEach((r) => bar(r, lift(el)));

  // The name: each word's band (its content box: the cap height), as wide as
  // its letters.
  for (const el of hero.querySelectorAll("[data-hero-word]")) {
    if (!shown(el)) continue;
    const box = contentBox(el);
    const chars = [...el.children].map((c) => c.getBoundingClientRect());
    if (!chars.length) continue;
    const left = Math.min(...chars.map((r) => r.left));
    const right = Math.max(...chars.map((r) => r.right));
    add("name", { left, top: box.top, width: right - left, height: box.height });
  }
  const portrait = hero.querySelector('[data-anim="portrait-clip"]');
  if (shown(portrait)) add("image", portrait.getBoundingClientRect());

  const statement = hero.querySelector('p[data-anim="copy"]');
  if (shown(statement)) lines(statement).forEach((r) => bar(r, lift(statement)));
  for (const el of hero.querySelectorAll('[data-anim="line"]')) {
    const mask = el.parentElement.getBoundingClientRect();
    lines(el).forEach((r) => bar({ left: r.left, top: mask.top, width: r.width, height: mask.height }));
  }
  for (const el of hero.querySelectorAll('[data-anim="tool"] img')) {
    if (shown(el)) add("card", el.getBoundingClientRect(), lift(el.closest('[data-anim="tool"]')));
  }
  const caption = hero.querySelector("figcaption");
  if (shown(caption)) [...caption.children].forEach((el) => lines(el).forEach((r) => bar(r, lift(caption))));
  return blocks;
}

function hasFill(el) {
  const bg = getComputedStyle(el).backgroundColor;
  return Boolean(bg) && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg);
}

function contentBox(el) {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const px = (v) => parseFloat(v) || 0;
  return {
    left: r.left + px(cs.paddingLeft),
    top: r.top + px(cs.paddingTop),
    width: r.width - px(cs.paddingLeft) - px(cs.paddingRight),
    height: r.height - px(cs.paddingTop) - px(cs.paddingBottom),
  };
}

// Rendered text lines of an element (fragments on one line merged).
function lines(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const out = [];
  for (const r of range.getClientRects()) {
    if (r.width < 2 || r.height < 2) continue;
    const last = out[out.length - 1];
    if (last && Math.abs(last.top - r.top) < r.height / 2) {
      last.left = Math.min(last.left, r.left);
      last.right = Math.max(last.right, r.right);
      last.bottom = Math.max(last.bottom, r.bottom);
    } else {
      out.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
    }
  }
  return out.map((r) => ({ left: r.left, top: r.top, width: r.right - r.left, height: r.bottom - r.top }));
}
