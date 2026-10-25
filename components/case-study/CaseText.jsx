import { Fragment } from "react";
import styles from "./CaseStudy.module.css";

// Renders copy from the data files. Bracketed gaps such as "[CONTENT TO ADD]"
// are highlighted so missing content is easy to spot on the page, and "\n"
// becomes a line break (e.g. a two-line heading).
export function copy(value) {
  if (typeof value !== "string") return value;
  if (value.includes("\n")) {
    return value.split("\n").map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {copy(line)}
      </Fragment>
    ));
  }
  if (!value.includes("[")) return value;
  return value.split(/(\[[^\]]+\])/).map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <mark key={i} className={styles.todo}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// Copy fields may be one string or a list of paragraphs.
export const paragraphs = (value) => (value == null ? [] : [].concat(value));

export const pad = (n) => String(n).padStart(2, "0");

// Paragraphs; a nested list renders inline ("a · b · c") and reads as a list.
export function Lines({ text }) {
  return paragraphs(text).map((line, i) =>
    Array.isArray(line) ? (
      <InlineList key={i} items={line} className={`block${i > 0 ? " mt-3" : ""}`} />
    ) : (
      <p key={i} className={i > 0 ? "mt-3" : undefined}>
        {copy(line)}
      </p>
    ),
  );
}

// A short run of items shown inline ("a · b · c") but announced as a list.
// Spans with list roles, so it can sit inside lists and paragraphs.
export function InlineList({ items, className = "" }) {
  return (
    <span role="list" className={className}>
      {items.map((item, i) => (
        <span key={item} role="listitem">
          {copy(item)}
          {i < items.length - 1 && <span aria-hidden="true"> · </span>}
        </span>
      ))}
    </span>
  );
}
