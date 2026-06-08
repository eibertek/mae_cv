import { ASSET_KEYS, PLAYER_SHEET } from "./assets.config";

export const PLAYER_CONFIG = {
  speed:       80,
  spriteKey:   ASSET_KEYS.PLAYER,
  frameWidth:  PLAYER_SHEET.frameWidth,
  frameHeight: PLAYER_SHEET.frameHeight,
  // 16×24 frame at scale 2 → 32×48 px on screen (Pokemon GBA feel)
  scale:       PLAYER_SHEET.displayScale,
  startX:      240,
  startY:      295,
};

// Frame index = row * 8 + col  (8 cols per row, 12 rows total)
//
// Col 0 of each row is a static reference pose — used for idle (single frame, slow loop).
// Walk animation uses cols 1–3 (3 frames per direction).
//
// Row 0: walk_down   Row 1: walk_up   Row 2: walk_left   Row 3: walk_right
// Rows 4–11: additional animations (TBD)

export const PLAYER_ANIMS = [
  // ── Idle (static reference frame, col 0 of each row) ────────────────────────
  { key: "idle_down",  frames: [0],          frameRate: 1, repeat: -1 },
  { key: "idle_up",    frames: [8],          frameRate: 1, repeat: -1 },
  { key: "idle_left",  frames: [16],         frameRate: 1, repeat: -1 },
  { key: "idle_right", frames: [24],         frameRate: 1, repeat: -1 },
  // ── Walk (cols 1–3 of each row) ─────────────────────────────────────────────
  { key: "walk_down",  frames: [1,  2,  3],  frameRate: 8, repeat: -1 },
  { key: "walk_up",    frames: [9,  10, 11], frameRate: 8, repeat: -1 },
  { key: "walk_left",  frames: [17, 18, 19], frameRate: 8, repeat: -1 },
  { key: "walk_right", frames: [25, 26, 27], frameRate: 8, repeat: -1 },
  // ── Attack (no attack row in this sprite — fallback to idle pose) ────────────
  { key: "attack_down",  frames: [0],  frameRate: 1, repeat: 0 },
  { key: "attack_up",    frames: [8],  frameRate: 1, repeat: 0 },
  { key: "attack_left",  frames: [16], frameRate: 1, repeat: 0 },
  { key: "attack_right", frames: [24], frameRate: 1, repeat: 0 },
];
