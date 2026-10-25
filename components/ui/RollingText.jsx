// Hover effect for links: the label rolls up and an identical copy rolls in.
// Place inside an element with the `group` class. Pure CSS, no JS.

export default function RollingText({ children }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
