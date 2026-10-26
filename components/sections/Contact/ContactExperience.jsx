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

  // Entrance (one-shot, at 85%): heading words, the intro, then the portrait,
  // switch and panel — short fades and small rises, no masks.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const q = gsap.utils.selector(rootRef);
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
          })
          .from(q("[data-contact-word]"), { opacity: 0, y: 16, duration: 0.4, stagger: 0.03 })
          .from(q("[data-contact-fade]"), { opacity: 0, y: 12, duration: 0.4, stagger: 0.04 }, 0.1)
          .from(q("[data-contact-clip]"), { opacity: 0, y: 16, duration: 0.4, clearProps: "opacity,transform" }, 0.15)
          .from(
            q("[data-contact-rise]"),
            { opacity: 0, y: 16, duration: 0.4, stagger: 0.05, clearProps: "opacity,transform" },
            0.2,
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
