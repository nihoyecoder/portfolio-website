"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import ArrowIcon from "@/components/ui/ArrowIcon";
import styles from "./CaseStudy.module.css";

const DESKTOP = "(min-width: 1024px)";

// A slim bar that slides in once the overview has scrolled away (desktop
// only) and highlights the part of the story being read. It hides again at
// the next-project hand-off. State changes only when the section changes.
export default function CaseNav({ title, items }) {
  const navRef = useRef(null);
  const progressRef = useRef(null);
  const [active, setActive] = useState(items[0].id);

  useGSAP(
    () => {
      const nav = navRef.current;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP, () => {
        const intro = document.querySelector("[data-case-hero-intro]");
        const next = document.querySelector("[data-case-next]");
        const sections = [...document.querySelectorAll("[data-nav-group]")];
        let current = null;
        let frame = 0;

        // Reads positions only; React updates only when the section changes.
        const update = () => {
          frame = 0;
          const past = intro.getBoundingClientRect().bottom < 0;
          const done = next ? next.getBoundingClientRect().top < 52 : false; // 52px = bar height
          nav.toggleAttribute("data-visible", past && !done);

          const line = window.innerHeight * 0.45;
          let group = sections[0].dataset.navGroup;
          for (const section of sections) {
            if (section.getBoundingClientRect().top <= line) group = section.dataset.navGroup;
          }
          if (group !== current) {
            current = group;
            setActive(group);
          }
        };
        const onScroll = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });

        // Reading progress, from the end of the overview to the hand-off.
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: intro,
              start: "bottom top",
              endTrigger: next ?? "body",
              end: next ? "top bottom" : "bottom bottom",
              scrub: true,
            },
          },
        );

        return () => {
          window.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(frame);
          nav.removeAttribute("data-visible");
        };
      });

      return () => mm.revert();
    },
    { dependencies: [] },
  );

  const go = (event, id) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav ref={navRef} aria-label="Case study sections" className={styles.nav}>
      <div className={styles.navInner}>
        <p className={`${styles.label} ${styles.navProject}`}>
          <Link href="/#work">
            <ArrowIcon direction="left" className="align-[-0.06em]" /> Work
          </Link>
          <span aria-hidden="true">/</span>
          <span className={styles.navTitle}>{title}</span>
        </p>
        <ol className={styles.navList}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.target}`}
                onClick={(event) => go(event, item.target)}
                aria-current={active === item.id ? "location" : undefined}
                className={`${styles.label} ${styles.navLink}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <span ref={progressRef} aria-hidden="true" className={styles.navProgress} />
    </nav>
  );
}
