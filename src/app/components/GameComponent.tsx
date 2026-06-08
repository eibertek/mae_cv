"use client";

import { useEffect, useRef } from "react";

export default function GameComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    async function initGame() {
      const { createGame } = await import("../../game/main");
      if (containerRef.current && !gameRef.current) {
        gameRef.current = createGame("game-container");
      }
    }

    initGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
