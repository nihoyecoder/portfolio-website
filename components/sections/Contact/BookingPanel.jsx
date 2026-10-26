"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "./icons";
import styles from "./Contact.module.css";
import ArrowIcon from "@/components/ui/ArrowIcon";

// Cal.com's dark theme mapped onto the Contact palette (Contact.module.css).
// The scheduler runs in an iframe, so colours are passed as values: tints of
// the Contact stage (#2a1d29) mixed with white, matching the CSS surfaces;
// the rose accent marks the brand (selected day, primary button).
const CAL_THEME = {
  "cal-brand": "#c4546a",
  "cal-brand-emphasis": "#d0657a",
  "cal-brand-text": "#ffffff",
  "cal-bg": "#352834", // 5%
  "cal-bg-muted": "#352834",
  "cal-bg-subtle": "#3d313c", // 9%
  "cal-bg-emphasis": "#4a3f49", // 15%
  "cal-border": "#504650", // 18%
  "cal-border-subtle": "#413641", // 11%
  "cal-border-booker": "#413641",
  "cal-text": "#f2ecec",
  "cal-text-emphasis": "#ffffff",
  "cal-text-subtle": "#bfb3bd",
  "cal-text-muted": "#bfb3bd",
};

const LOAD_TIMEOUT = 20_000;

// The Cal.com inline embed: date → time → details → confirmation all happen
// inside this panel; Cal.com owns availability, time zones and bookings.
// It loads once `load` turns true (first hover/focus/click on "Book a call")
// and then stays mounted, so the visitor's progress survives mode switches.
export default function BookingPanel({ cal, load, onRequestMessage }) {
  const mountRef = useRef(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState("loading"); // loading | ready | failed

  useEffect(() => {
    if (!cal.configured || !load || startedRef.current) return;
    startedRef.current = true;

    let timer;
    const fail = () => setStatus((current) => (current === "ready" ? current : "failed"));
    const ready = () => {
      clearTimeout(timer);
      setStatus("ready");
    };

    const namespace = `intro${Math.random().toString(36).slice(2, 8)}`;
    const Cal = loadCal(cal.embedScript, fail);
    Cal("init", namespace, { origin: cal.origin });
    const api = Cal.ns[namespace];
    api("on", { action: "linkReady", callback: ready });
    api("on", { action: "linkFailed", callback: fail });
    api("inline", {
      elementOrSelector: mountRef.current,
      calLink: cal.link,
      config: { layout: "month_view", theme: "dark" },
    });
    api("ui", {
      theme: "dark",
      layout: "month_view",
      hideEventTypeDetails: false,
      cssVarsPerTheme: { dark: CAL_THEME },
    });
    timer = setTimeout(fail, LOAD_TIMEOUT);
    // No cleanup: the iframe lives as long as this panel and leaves with it.
  }, [cal, load]);

  if (!cal.configured) {
    return (
      <div className={styles.booking}>
        <div className={styles.bookingNote}>
          <span className={styles.bookingIcon}>
            <CalendarIcon width="20" height="20" />
          </span>
          <h3 className={styles.bookingTitle}>Booking calendar</h3>
          {process.env.NODE_ENV === "production" ? (
            <>
              <p className={styles.bookingText}>
                Online booking isn&apos;t open yet. Send a message and I&apos;ll get back to you.
              </p>
              <button type="button" onClick={onRequestMessage} className={styles.secondary}>
                Send a message
              </button>
            </>
          ) : (
            <>
              <p className={styles.bookingText}>Add NEXT_PUBLIC_CAL_LINK to enable scheduling.</p>
              <code className={styles.code}>NEXT_PUBLIC_CAL_LINK={cal.placeholder}</code>
              <p className={styles.bookingHint}>Set it in .env.local — visible in development only.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    // data-lenis-prevent: excluded from smooth scrolling if Lenis is ever added.
    <div className={styles.booking} data-lenis-prevent>
      <div ref={mountRef} data-ready={status === "ready" || undefined} className={styles.calMount} />

      {status === "loading" && <BookingSkeleton />}

      {status === "failed" && (
        <div className={`${styles.bookingNote} ${styles.bookingCover}`}>
          <span className={styles.bookingIcon}>
            <CalendarIcon width="20" height="20" />
          </span>
          <h3 className={styles.bookingTitle}>The booking calendar didn&apos;t load.</h3>
          <p className={styles.bookingText}>
            You can open it on Cal.com instead, or send me a message.
          </p>
          <div className={styles.bookingActions}>
            {cal.pageUrl && (
              <a href={cal.pageUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
                Open booking page <ArrowIcon />
              </a>
            )}
            <button type="button" onClick={onRequestMessage} className={styles.secondary}>
              Send a message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder in the shape of Cal.com's stacked layout while it loads.
function BookingSkeleton() {
  return (
    <div className={styles.skeleton} role="status">
      <span className="sr-only">Loading the booking calendar…</span>
      <span aria-hidden="true" className={`${styles.bone} ${styles.boneAvatar}`} />
      <span aria-hidden="true" className={styles.bone} style={{ width: "34%", height: 12 }} />
      <span aria-hidden="true" className={styles.bone} style={{ width: "58%", height: 22 }} />
      <span aria-hidden="true" className={styles.bone} style={{ width: "82%", height: 12 }} />
      <span aria-hidden="true" className={styles.bone} style={{ width: "26%", height: 12, marginTop: 12 }} />
      <span aria-hidden="true" className={styles.boneDays}>
        {Array.from({ length: 35 }, (_, i) => (
          <span key={i} className={styles.bone} />
        ))}
      </span>
    </div>
  );
}

// Cal.com's official embed snippet, written out: queues calls until
// embed.js has loaded, then embed.js takes over window.Cal. The script is
// appended here (not by the snippet) so a blocked load can be reported.
function loadCal(src, onError) {
  if (window.Cal) return window.Cal;

  const queue = (api, args) => api.q.push(args);
  const Cal = function (...args) {
    if (args[0] !== "init") return queue(Cal, args);
    const namespace = args[1];
    if (typeof namespace !== "string") return queue(Cal, args);
    if (!Cal.ns[namespace]) {
      const api = (...apiArgs) => queue(api, apiArgs);
      api.q = [];
      Cal.ns[namespace] = api;
    }
    queue(Cal.ns[namespace], args);
    queue(Cal, ["initNamespace", namespace]);
  };
  Cal.ns = {};
  Cal.q = [];
  Cal.loaded = true;
  window.Cal = Cal;

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.addEventListener("error", onError);
  document.head.appendChild(script);
  return Cal;
}
