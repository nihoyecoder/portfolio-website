// Shared motion tokens so every section moves with the same character.

export const ease = {
  out: "power4.out",
  inOut: "power4.inOut",
  soft: "power2.out",
};

export const duration = {
  fast: 0.6,
  base: 0.9,
  slow: 1.2,
};

// Media queries for gsap.matchMedia(). Animations live under `motion`;
// pointer effects additionally require a fine pointer and a wide viewport.
export const media = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  pointer: "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 768px)",
  // Direct manipulation (the hero's editable portrait): a mouse on desktop
  // widths, or a touchscreen (phones, tablets) at any width.
  edit: "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 1024px)",
  editTouch: "(prefers-reduced-motion: no-preference) and (pointer: coarse)",
};
