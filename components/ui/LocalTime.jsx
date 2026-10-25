"use client";

import { useSyncExternalStore } from "react";

// Ticks once per minute. The server snapshot is null so the server and the
// hydrating client agree ("--:--"), then the real time fills in.
const subscribe = (onChange) => {
  const id = setInterval(onChange, 10_000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

export default function LocalTime({ timeZone, label }) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);

  const time =
    minute === null
      ? "--:--"
      : new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone,
        }).format(minute * 60_000);

  return (
    <span className="tabular-nums">
      {time} {label}
    </span>
  );
}
