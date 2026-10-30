"use client";

import { useEffect } from "react";
import { useLinkStatus } from "next/link";

// Click feedback for a <Link> whose route isn't ready yet (prefetch still in
// flight, slow network): a thin bar runs along the link's bottom edge and the
// cursor shows progress, so a click visibly registers instead of looking
// ignored. Render it inside the Link; the Link needs `relative` positioning.
// Always rendered at a fixed size, so toggling it never shifts layout.
export default function LinkPending() {
  const { pending } = useLinkStatus();

  useEffect(() => {
    if (!pending) return;
    const root = document.documentElement;
    root.setAttribute("data-navigating", "");
    return () => root.removeAttribute("data-navigating");
  }, [pending]);

  return (
    <span
      aria-hidden="true"
      data-link-pending={pending ? "" : undefined}
      className="link-pending pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
    />
  );
}
