// Shown at once if a case study is opened before its data has arrived (a
// slow network, or a click before prefetching finished), so the click always
// lands somewhere instead of the page looking stuck.
export default function Loading() {
  return (
    <div role="status" className="flex min-h-svh items-center justify-center px-5">
      <div className="flex flex-col items-center gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        <span>Opening case study</span>
        <span aria-hidden="true" className="relative block h-[2px] w-40 overflow-hidden bg-line">
          <span className="link-pending absolute inset-0" data-link-pending="" />
        </span>
      </div>
    </div>
  );
}
