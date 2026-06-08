"use client";

import { useEffect, useState } from "react";

const LS_KEY = "mae_cv_muted";

export function MuteButton() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(localStorage.getItem(LS_KEY) === "1");
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem(LS_KEY, next ? "1" : "0");
    window.dispatchEvent(new CustomEvent("mae_cv_mute", { detail: next }));
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute" : "Mute"}
      className="font-mono text-xs px-2 py-1 rounded border border-gray-700 bg-gray-900 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
    >
      {muted ? "🔇 Mute" : "🔊 Sound"}
    </button>
  );
}
