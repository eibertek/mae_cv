"use client";

import { useEffect, useState } from "react";
import { KEYS, keyDown, keyUp } from "@/game/input/dispatchKey";

const LS_MUTE = "mae_cv_muted";

function MobileMuteBtn() {
  const [muted, setMuted] = useState(false);
  useEffect(() => { setMuted(localStorage.getItem(LS_MUTE) === "1"); }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem(LS_MUTE, next ? "1" : "0");
    window.dispatchEvent(new CustomEvent("mae_cv_mute", { detail: next }));
  };

  return (
    <button
      onClick={toggle}
      className="pointer-events-auto w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white text-base flex items-center justify-center active:bg-white/35 select-none touch-manipulation"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

type KeyDef = (typeof KEYS)[keyof typeof KEYS];

function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);
  return isTouch;
}

function GameBtn({
  k,
  children,
  className,
}: {
  k: KeyDef;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`select-none touch-manipulation flex items-center justify-center active:scale-95 transition-transform ${className ?? ""}`}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={(e) => { e.preventDefault(); keyDown(k); }}
      onTouchEnd={(e)   => { e.preventDefault(); keyUp(k);   }}
      onTouchCancel={()  => keyUp(k)}
      // also support mouse for desktop testing
      onMouseDown={() => keyDown(k)}
      onMouseUp={()   => keyUp(k)}
      onMouseLeave={()=> keyUp(k)}
    >
      {children}
    </button>
  );
}

export function MobileControls() {
  const isTouch = useTouchDevice();
  if (!isTouch) return null;

  const btnBase = "rounded-xl bg-white/15 backdrop-blur-sm text-white border border-white/20 active:bg-white/35";
  const w10 = "w-10 h-10 text-lg";
  const actionBtn = "w-14 h-11 text-xs font-mono font-bold";

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between px-3 pt-2 pb-3">

      {/* Top-right: mute button */}
      <div className="flex justify-end opacity-70">
        <MobileMuteBtn />
      </div>

      {/* Bottom row: D-pad + action buttons */}
      <div className="flex items-end justify-between">

      {/* D-pad — 3×3 grid, 4 corners empty */}
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-[3px] opacity-80">
        {/* row 1 */}
        <div /> {/* empty */}
        <GameBtn k={KEYS.UP}    className={`${btnBase} ${w10}`}>▲</GameBtn>
        <div />
        {/* row 2 */}
        <GameBtn k={KEYS.LEFT}  className={`${btnBase} ${w10}`}>◀</GameBtn>
        <div className="w-10 h-10 rounded-xl bg-white/5" /> {/* center */}
        <GameBtn k={KEYS.RIGHT} className={`${btnBase} ${w10}`}>▶</GameBtn>
        {/* row 3 */}
        <div />
        <GameBtn k={KEYS.DOWN}  className={`${btnBase} ${w10}`}>▼</GameBtn>
        <div />
      </div>

      {/* Action buttons */}
      <div className="pointer-events-auto flex flex-col gap-2 opacity-80">
        <GameBtn k={KEYS.SPACE} className={`${actionBtn} bg-yellow-400/25 border border-yellow-300/30 text-yellow-100 rounded-xl`}>
          ✓ ACT
        </GameBtn>
        <GameBtn k={KEYS.ESC}   className={`${actionBtn} bg-red-400/20 border border-red-300/25 text-red-200 rounded-xl`}>
          ✕ ESC
        </GameBtn>
      </div>

      </div> {/* end bottom row */}
    </div>
  );
}
