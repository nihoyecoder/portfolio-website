"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

export default function MobileMenu({ links, contact }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-anim="nav"
        onClick={() => setOpen((value) => !value)}
        className="relative z-50 -m-2 p-2 text-sm"
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-0 z-40 bg-background px-5 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))]"
      >
        <ul className="flex flex-col gap-1">
          {[...links, contact].map((link) => {
            const className = "block py-1 text-5xl font-medium tracking-[-0.04em]";
            return (
              <li key={link.href}>
                {/* Section anchors load normally so the home page can size itself first */}
                {link.href.includes("#") ? (
                  <a href={link.href} onClick={close} className={className}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} prefetch={false} onClick={close} className={className}>
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
