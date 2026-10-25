"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, media, useGSAP } from "@/lib/gsap";
import BookingPanel from "./BookingPanel";
import ContactForm from "./ContactForm";
import ContactModeSwitch, { panelId, tabId } from "./ContactModeSwitch";
import styles from "./Contact.module.css";

// Owns the contact mode ("message" | "booking"): the switch under the
// portrait selects it, the panel on the right shows it. Both panels stay
// mounted, so typed values and booking progress survive switching.
// `identity` (heading, intro, portrait) is rendered on the server.
export default function ContactExperience({ identity, cal, email }) {
  const rootRef = useRef(null);
  const [mode, setMode] = useState("message");
  const [bookingWanted, setBookingWanted] = useState(false);
  const shownMode = useRef(mode);

  const select = useCallback((next) => {
    if (next === "booking") setBookingWanted(true);
    setMode(next);
  }, []);
  const warmBooking = useCallback(() => setBookingWanted(true), []);
  // From buttons inside the booking panel: hand focus back to the tabs.
  const backToMessage = useCallback(() => {
    setMode("message");
    requestAnimationFrame(() => document.getElementById(tabId("message"))?.focus());
  }, []);

  // Entrance: heading words rise, portrait opens, switch and panel follow.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const q = gsap.utils.selector(rootRef);
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: rootRef.current, start: "top 78%", once: true },
          })
          .from(q("[data-contact-word]"), { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.06 })
          .from(q("[data-contact-fade]"), { opacity: 0, y: 16, duration: 0.8 }, 0.3)
          .fromTo(
            q("[data-contact-clip]"),
            { clipPath: "inset(12% 8% 12% 8% round 12px)" },
            { clipPath: "inset(0% 0% 0% 0% round 12px)", duration: 1.3, ease: "power4.out", clearProps: "clipPath" },
            0.15,
          )
          .from(q("[data-contact-clip] > *"), { scale: 1.1, duration: 1.6, clearProps: "transform" }, 0.15)
          .from(
            q("[data-contact-rise]"),
            { opacity: 0, y: 24, duration: 0.9, stagger: 0.1, clearProps: "opacity,transform" },
            0.4,
          );
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Mode change: the old panel sinks and fades, the new one rises in.
  useGSAP(
    () => {
      const from = shownMode.current;
      if (from === mode) return;
      shownMode.current = mode;

      const root = rootRef.current;
      const incoming = root.querySelector(`[data-panel="${mode}"]`);
      const outgoing = root.querySelector(`[data-panel="${from}"]`);
      const both = [incoming, outgoing];
      const settle = () => gsap.set(both, { clearProps: "opacity,visibility,transform" });

      gsap.killTweensOf(both);
      if (window.matchMedia(media.reduced).matches) {
        settle();
        return;
      }

      // CSS already hides the now-inactive panel; keep it visible to fade it out.
      gsap.set(outgoing, { visibility: "inherit" });
      gsap
        .timeline({ onComplete: settle })
        .to(outgoing, { autoAlpha: 0, y: 10, duration: 0.2, ease: "power1.in" })
        .fromTo(
          incoming,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" },
          0.16,
        );
    },
    { scope: rootRef, dependencies: [mode] },
  );

  const panel = (id) => ({
    role: "tabpanel",
    id: panelId(id),
    "aria-labelledby": tabId(id),
    "data-panel": id,
    "data-active": mode === id,
    inert: mode !== id,
    className: styles.panel,
  });

  return (
    <div ref={rootRef} className={styles.layout}>
      <div className={styles.identity}>
        {identity}
        <ContactModeSwitch mode={mode} onSelect={select} onIntent={warmBooking} />
      </div>

      <div data-contact-rise className={styles.panels}>
        <div {...panel("message")}>
          <ContactForm email={email} />
        </div>
        <div {...panel("booking")}>
          <BookingPanel cal={cal} load={bookingWanted} onRequestMessage={backToMessage} />
        </div>
      </div>
    </div>
  );
}
