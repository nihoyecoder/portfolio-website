export default function AvailabilityBadge({ children, className = "", ...props }) {
  return (
    <p className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-signal motion-safe:animate-soft-pulse" />
        <span className="relative size-1.5 rounded-full bg-signal" />
      </span>
      {children}
    </p>
  );
}
