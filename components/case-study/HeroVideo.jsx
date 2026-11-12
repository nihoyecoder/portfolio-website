"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./CaseStudy.module.css";

// A case-study hero video with sound (study.heroVideo). Nothing downloads
// until it's asked for (preload="none"): the poster, a preloaded next/image,
// covers the video with one round Play button, and the whole poster starts
// it. Playing brings sound and the browser's own controls; the poster stays
// up until the first frame plays, so the box never flashes black. Keyboard
// focus moves to the video, so it can be paused right away. The box keeps the
// video's shape throughout, so nothing on the page shifts. Under it, a
// caption says what it shows, how long it is and that it has sound.
//
// video: { src, width, height, title, duration, caption?, poster: { src },
//          captions? } (captions: a WebVTT file, added as an English track).
export default function HeroVideo({ video, sizes }) {
  const ref = useRef(null);
  // idle → loading (asked to play) → playing (first frame on screen)
  const [state, setState] = useState("idle");
  const playing = state === "playing";

  const start = () => {
    if (state !== "idle") return;
    setState("loading");
    // If the browser refuses to start it, fall back to its own controls.
    ref.current?.play().catch(() => setState("playing"));
  };

  const onPlaying = () => {
    if (playing) return;
    setState("playing");
    // The Play button is about to disappear; keep focus on the player.
    requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
  };

  return (
    <>
      <div className={styles.heroVideo} style={{ aspectRatio: `${video.width} / ${video.height}` }}>
        <video
          ref={ref}
          width={video.width}
          height={video.height}
          preload="none"
          playsInline
          controls={playing}
          aria-label={video.title}
          onPlaying={onPlaying}
          className={styles.heroVideoMedia}
        >
          <source src={video.src} type="video/mp4" />
          {video.captions && <track kind="captions" src={video.captions} srcLang="en" label="English" default />}
          <a href={video.src}>Download the {video.title} (MP4)</a>
        </video>

        {!playing && (
          <button
            type="button"
            onClick={start}
            aria-busy={state === "loading" || undefined}
            aria-label={`Play the ${video.title}, ${video.duration}, with sound`}
            className={styles.heroVideoCover}
          >
            <Image src={video.poster.src} alt="" fill sizes={sizes} preload className={styles.heroVideoPoster} />
            <span aria-hidden="true" className={styles.heroVideoPlay}>
              {state === "loading" ? (
                <span className={styles.heroVideoSpinner} />
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />
                </svg>
              )}
            </span>
          </button>
        )}

        {/* Without JavaScript the button can't start it: link the file instead. */}
        <noscript>
          <a href={video.src} className={styles.heroVideoFallback}>
            Watch the {video.title} (MP4, {video.duration})
          </a>
        </noscript>
      </div>

      {video.caption && (
        <p className={styles.caption}>
          {video.caption} <span className={styles.heroVideoTime}>{video.duration} · with sound</span>
        </p>
      )}
    </>
  );
}
