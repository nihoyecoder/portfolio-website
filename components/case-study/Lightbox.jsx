"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./CaseStudy.module.css";

// A small "view full size" button for dense screenshots. Opens a native
// <dialog> (Esc and the close button dismiss it; so does a click outside the
// image). The full-size image only loads once the dialog opens.
export default function Lightbox({ image }) {
  const ref = useRef(null);
  const name = image.label || image.alt;

  return (
    <>
      <button
        type="button"
        className={styles.zoomButton}
        onClick={() => ref.current?.showModal()}
        aria-label={`View full size: ${name}`}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16">
          <path
            d="M12 3h5v5M8 17H3v-5M17 3l-6 6M3 17l6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <dialog
        ref={ref}
        aria-label={name}
        className={styles.lightbox}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <form method="dialog" className={styles.lightboxBar}>
          <span className={styles.label}>{name}</span>
          <button type="submit" className={styles.lightboxClose} aria-label="Close full-size view">
            <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
              <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="100vw"
          quality={image.quality}
          className={styles.lightboxImage}
        />
      </dialog>
    </>
  );
}
