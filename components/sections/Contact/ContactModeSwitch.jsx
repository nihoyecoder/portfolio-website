"use client";

import { useRef } from "react";
import { MessageIcon, PhoneIcon } from "./icons";
import styles from "./Contact.module.css";

const MODES = [
  { id: "message", label: "Send a message", short: "Message", Icon: MessageIcon },
  { id: "booking", label: "Book a call", Icon: PhoneIcon },
];

export const tabId = (mode) => `contact-tab-${mode}`;
export const panelId = (mode) => `contact-panel-${mode}`;

// Tabs with manual activation: arrow keys move focus, Enter/Space selects,
// so browsing the tabs never loads the scheduler by accident.
// From 1024px the inactive tab collapses to its icon (label kept for screen
// readers, shown as a tooltip on hover/focus); below that both are labelled.
export default function ContactModeSwitch({ mode, onSelect, onIntent }) {
  const listRef = useRef(null);

  const onKeyDown = (event) => {
    const tabs = [...listRef.current.querySelectorAll('[role="tab"]')];
    const index = tabs.indexOf(document.activeElement);
    const target = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (index === -1 || target === undefined) return;
    event.preventDefault();
    tabs[(target + tabs.length) % tabs.length].focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="How would you like to get in touch?"
      data-contact-rise
      className={styles.switch}
      onKeyDown={onKeyDown}
    >
      {MODES.map(({ id, label, short, Icon }) => {
        const selected = id === mode;
        // Hovering or focusing "Book a call" starts loading the scheduler.
        const intent = id === "booking" && !selected ? onIntent : undefined;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={tabId(id)}
            aria-selected={selected}
            aria-controls={panelId(id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(id)}
            onPointerEnter={intent}
            onFocus={intent}
            className={styles.tab}
          >
            <Icon className={styles.tabIcon} />
            <span className={styles.tabLabel}>
              <span className={short ? styles.labelFull : undefined}>{label}</span>
              {short && <span className={styles.labelShort}>{short}</span>}
            </span>
            <span aria-hidden="true" className={styles.tooltip}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
