// Small monochrome line icons for the Contact section (24px grid, currentColor).

function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MessageIcon(props) {
  return (
    <Icon {...props}>
      <path d="M11 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V13" />
      <path d="M17.6 3.9a1.9 1.9 0 0 1 2.7 2.7l-7.4 7.4-3.4.8.8-3.4Z" />
    </Icon>
  );
}

export function PhoneIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6.7 3.8h2.4c.4 0 .8.3.9.7l.9 3.5c.1.4 0 .8-.4 1l-1.8 1.2a11.5 11.5 0 0 0 5.1 5.1l1.2-1.8c.2-.4.6-.5 1-.4l3.5.9c.4.1.7.5.7.9v2.4a2 2 0 0 1-2.1 2A16 16 0 0 1 4.7 5.9a2 2 0 0 1 2-2.1Z" />
    </Icon>
  );
}

export function CalendarIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </Icon>
  );
}

export function ChevronIcon(props) {
  return (
    <Icon {...props}>
      <path d="m7 10 5 5 5-5" />
    </Icon>
  );
}

export function ArrowIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />
    </Icon>
  );
}

export function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="m5.5 12.5 4 4 9-9" />
    </Icon>
  );
}

export function AlertIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5M12 16h.01" />
    </Icon>
  );
}
