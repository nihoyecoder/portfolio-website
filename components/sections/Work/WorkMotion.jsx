"use client";

import { useRef } from "react";
import { coverExit, gsap, media, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Scroll distance (in viewport heights) the last project rests before the stage releases.
const HOLD = 0.35;

// Owns the Selected Work scroll presentation. Markup comes from Work.jsx
// (a Server Component) and is addressed through data-work-* hooks.
//
// Timeline units = viewport heights of scroll:
//   0 → 1      composes the first project (colours, panels, text); never
//              scrubbed — the section slides up over the pinned hero already
//              in this state (see HeroMotion), as one opaque layer
//   1 → count  held (sticky); project i is centred at time i + 1
//   + HOLD     the last project rests, then the stage releases
// Scroll drives time 1 → total from the moment Work's top reaches the
// viewport top — where the hero pin ends — so the two never overlap.
// One scrubbed timeline drives everything, so it is reversible by design.
export default function WorkMotion({ palette, children, ...props }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        root.dataset.mode = "stage";

        const q = gsap.utils.selector(root);
        const [stage] = q("[data-work-stage]");
        const projects = q("[data-project]");
        const panels = q("[data-work-panel]");
        const pills = q("[data-work-pill]");
        const buttons = q("[data-work-goto]");
        const count = projects.length;
        const total = count + HOLD;

        // Start the text from clean transforms. A previous build of this
        // timeline (a breakpoint change, or React's dev double-mount) can leave
        // an inline transform that a new tween would read back as a fixed y offset.
        gsap.set(q("[data-work-char], [data-work-line], [data-work-desc]"), { clearProps: "transform" });

        // ---- Panels, indicator and active project are derived from p ----
        const state = { p: -1 };
        let active = -1;

        const render = () => {
          for (let i = 0; i < count; i++) {
            const offset = i - state.p;
            const focus = Math.max(0, 1 - Math.abs(offset));
            panels[i].style.setProperty("--offset", offset.toFixed(4));
            panels[i].style.setProperty("--focus", focus.toFixed(4));
            panels[i].style.zIndex = String(1 + Math.round(focus * 8));
            pills[i]?.style.setProperty("--focus", focus.toFixed(4));
          }

          const current = gsap.utils.clamp(0, count - 1, Math.round(state.p));
          if (current !== active) {
            // A straightened stack never carries over to the next project.
            release(active);
            active = current;
            if (leads[current]?.matches(":focus-visible")) hold(current, "focus");
            projects.forEach((el, i) => el.toggleAttribute("data-active", i === current));
            buttons.forEach((el, i) => el.setAttribute("aria-current", String(i === current)));
          }
        };

        // ---- Lead visual: hover / keyboard focus straightens the stack ----
        // One paused tween per panel animates --hover; Work.module.css derives
        // the front-facing lead and the tucked-in supporting visuals from it.
        // Scroll only writes --offset / --focus, so the two never collide, and
        // reversing to --hover: 0 restores the resting composition exactly.
        const leads = panels.map((panel) => panel.querySelector('[data-role="lead"]'));
        const straighten = panels.map((panel) =>
          gsap.fromTo(
            panel,
            { "--hover": 0 },
            { "--hover": 1, duration: 0.65, ease: "power3.inOut", paused: true },
          ),
        );
        const holds = panels.map(() => new Set()); // "pointer" and/or "focus"

        function hold(i, reason) {
          if (i !== active) return;
          holds[i].add(reason);
          straighten[i].play();
        }
        function letGo(i, reason) {
          holds[i].delete(reason);
          if (!holds[i].size) straighten[i].reverse();
        }
        function release(i) {
          if (i < 0 || !straighten[i]) return;
          holds[i].clear();
          straighten[i].reverse();
        }

        const onLeadEnter = (event) => {
          if (event.pointerType !== "touch") hold(leads.indexOf(event.currentTarget), "pointer");
        };
        const onLeadLeave = (event) => letGo(leads.indexOf(event.currentTarget), "pointer");
        const onLeadFocus = (event) => {
          if (event.currentTarget.matches(":focus-visible")) hold(leads.indexOf(event.currentTarget), "focus");
        };
        const onLeadBlur = (event) => letGo(leads.indexOf(event.currentTarget), "focus");
        const leadListeners = [
          ["pointerenter", onLeadEnter],
          ["pointerleave", onLeadLeave],
          ["focus", onLeadFocus],
          ["blur", onLeadBlur],
        ];
        leads.forEach((lead) => leadListeners.forEach(([type, fn]) => lead?.addEventListener(type, fn)));

        // ---- Velocity bend: panels lean slightly while scrolling fast ----
        const bend = { value: 0 };
        const bendTo = gsap.quickTo(bend, "value", {
          duration: 0.6,
          ease: "power3.out",
          onUpdate: () => stage.style.setProperty("--bend", bend.value.toFixed(3)),
        });
        const settle = () => bendTo(0);

        // ---- Timeline ----
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

        tl.fromTo(state, { p: -1 }, { p: count - 1, duration: count, onUpdate: render }, 0).set(
          {},
          {},
          total,
        );

        // Colours: the first project's from the start (the section covers the
        // hero already in them — a strong light → colour edge), then project → project.
        tl.set(
          stage,
          {
            "--work-bg": palette[0].background,
            "--work-fg": palette[0].foreground,
            "--work-accent": palette[0].accent,
          },
          0,
        );

        for (let i = 1; i < count; i++) {
          tl.to(stage, { "--work-bg": palette[i].background, duration: 0.6, ease: "sine.inOut" }, i + 0.2).to(
            stage,
            { "--work-fg": palette[i].foreground, "--work-accent": palette[i].accent, duration: 0.16 },
            i + 0.42,
          );
        }

        // Gradients fade in with their project's colour and out as it leaves.
        stage.querySelectorAll("[data-work-glow]").forEach((glow) => {
          const i = Number(glow.dataset.workGlow);
          if (i === 0) tl.set(glow, { opacity: 1 }, 0);
          else tl.to(glow, { opacity: 1, duration: 0.6, ease: "sine.inOut" }, i + 0.2);
          if (i < count - 1) tl.to(glow, { opacity: 0, duration: 0.6, ease: "sine.inOut" }, i + 1.2);
        });

        // Text: each project's lines rise out of their masks as it leaves and
        // the next project's lines rise in behind them.
        projects.forEach((el, i) => {
          const metaLine = el.querySelector('[data-work-line="meta"]');
          const chars = el.querySelectorAll("[data-work-char]");
          const desc = el.querySelector("[data-work-desc]");
          const cta = el.querySelector('[data-work-line="cta"]');
          // The first project's text is fully in by time 1 (see above).
          const inAt = i === 0 ? 0.3 : i + 0.45;
          const rise = { yPercent: 0, duration: 0.42, ease: "power3.out" };

          // Travel distances clear each mask completely (title masks include
          // descender room; the CTA mask includes focus-ring padding).
          tl.fromTo(metaLine, { yPercent: 110 }, rise, inAt)
            .fromTo(chars, { yPercent: 130 }, { ...rise, stagger: 0.025 }, inAt + 0.03)
            .fromTo(desc, { yPercent: 105 }, rise, inAt + 0.12)
            .fromTo(cta, { yPercent: 180 }, rise, inAt + 0.18);

          if (i < count - 1) {
            const outAt = i + 1.04;
            const leave = { duration: 0.3, ease: "power2.in" };

            tl.to(metaLine, { ...leave, yPercent: -110 }, outAt)
              .to(chars, { ...leave, yPercent: -130, stagger: 0.012 }, outAt)
              .to(desc, { ...leave, yPercent: -105 }, outAt + 0.02)
              .to(cta, { ...leave, yPercent: -180 }, outAt + 0.04);
          }
        });

        // Start composed: the first project, centred, in its colours.
        tl.time(1);
        render();

        // ---- Scroll ----
        const vh = () => window.innerHeight;

        // The stage is CSS sticky inside .root (see Work.module.css); .root gets
        // the scroll length here. Unlike a ScrollTrigger pin, native sticky never
        // switches the stage to position: fixed, so it can't jitter or register
        // as a layout shift when the next section scrolls in.
        //
        // Cover: the stage stays stuck for one extra stage height (--cover),
        // and .root's matching negative margin pulls the next section up by
        // the same amount, so that section slides over the still stage. The
        // page's total length doesn't change.
        let cover = 0;
        const fitScrollLength = () => {
          root.style.setProperty("--stage-scroll", `${vh() * (count - 1 + HOLD)}px`);
          cover = stage.offsetHeight;
          root.style.setProperty("--cover", `${cover}px`);
        };
        fitScrollLength();
        ScrollTrigger.addEventListener("refreshInit", fitScrollLength);

        // Scroll plays time 1 → total over exactly the sticky range.
        const span = total - 1;
        const drive = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${vh() * span}`,
          animation: tl.tweenFromTo(1, total, { paused: true, ease: "none" }),
          scrub: 1,
          // Settle on the nearest project once scrolling stops (not in the final hold).
          snap: {
            snapTo: (value) => {
              const time = 1 + value * span;
              return time > count ? value : (Math.round(time) - 1) / span;
            },
            duration: { min: 0.3, max: 0.8 },
            delay: 0.08,
            inertia: false,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            bendTo(gsap.utils.clamp(-1, 1, velocity / -2500));
            // Scrolling away while straightened: hand the stack back first.
            if (Math.abs(velocity) > 600 && holds[active]?.size) release(active);
          },
        });

        ScrollTrigger.addEventListener("scrollEnd", settle);

        // While the next section covers the stage, its content (projects,
        // top bar, indicator) sinks, tips back and fades 1:1 with the scroll,
        // like the hero's; the background layers stay. Runs from the next
        // section's top entering the viewport to it reaching the top — after
        // the projects' range.
        const layers = [...stage.children].filter((el) => el.getAttribute("aria-hidden") !== "true");
        const fall = coverExit(stage, layers);

        ScrollTrigger.create({
          trigger: root,
          start: () => `bottom-=${cover} bottom`,
          end: () => `bottom-=${cover} top`,
          onUpdate: (self) => fall(self.progress),
          onRefresh: (self) => fall(self.progress, true),
        });

        // ---- Indicator clicks and keyboard focus scroll to a project ----
        const scrollToProject = (i) => {
          const y = drive.start + (i / span) * (drive.end - drive.start);
          window.scrollTo({ top: y, behavior: "smooth" });
        };

        const onClick = (event) => {
          const button = event.target.closest("[data-work-goto]");
          if (button) scrollToProject(Number(button.dataset.workGoto));
        };

        const onFocusIn = (event) => {
          const i = projects.indexOf(event.target.closest("[data-project]"));
          if (i !== -1 && i !== active) scrollToProject(i);
        };

        root.addEventListener("click", onClick);
        root.addEventListener("focusin", onFocusIn);

        // Hero height can change once web fonts swap in.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          root.removeEventListener("click", onClick);
          root.removeEventListener("focusin", onFocusIn);
          leads.forEach((lead) => leadListeners.forEach(([type, fn]) => lead?.removeEventListener(type, fn)));
          ScrollTrigger.removeEventListener("scrollEnd", settle);
          ScrollTrigger.removeEventListener("refreshInit", fitScrollLength);
          delete root.dataset.mode;
          root.style.removeProperty("--stage-scroll");
          root.style.removeProperty("--cover");
          stage.style.removeProperty("--bend");
          for (const el of [...panels, ...pills]) {
            el.style.removeProperty("--offset");
            el.style.removeProperty("--focus");
            el.style.removeProperty("z-index");
          }
          projects.forEach((el) => el.removeAttribute("data-active"));
          buttons.forEach((el) => el.removeAttribute("aria-current"));
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
