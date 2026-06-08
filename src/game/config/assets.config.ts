// ─── Asset keys (used in Phaser loader and texture lookups) ──────────────────
export const ASSET_KEYS = {
  PLAYER:           "player",
  MALL_ENTRANCE:    "mall_entrance",
  MALL_ENTRANCE_FG: "mall_entrance_fg",
  MALL_WAYPOINTS:   "mall_waypoints",
  GENERIC_STORE:    "generic_store",
  TECH_STORE:       "tech_store",
  TECH_STORE_2:     "tech_store_2",
  INDOOR_ASSETS:    "indoor_assets",
} as const;

// ─── Paths relative to /public ───────────────────────────────────────────────
export const ASSET_PATHS = {
  PLAYER:           "assets/mae_cv_character.png",
  MALL_ENTRANCE:    "assets/shopping_entrance.png",
  MALL_ENTRANCE_FG: "assets/shopping_entrance_depth2.png",
  MALL_WAYPOINTS:   "assets/shopping_waypoints.png",
  GENERIC_STORE:    "assets/shopping_generic_store.png",
  TECH_STORE:       "assets/shopping_tech_store.png",
  TECH_STORE_2:     "assets/shopping_tech_store_2.png",
  INDOOR_ASSETS:    "assets/shopping_indoor_assets.png",
} as const;

// ─── Player spritesheet ───────────────────────────────────────────────────────
// mae_cv_character.png — 768×1377 px, 8 cols × 12 rows = 96×115 px per frame.
//
// Col 0 of every row is a static reference pose (not part of animation).
// Animation frames use cols 1–3 (3 frames per direction).
//
// Row 0: walk_down   Row 1: walk_up   Row 2: walk_left   Row 3: walk_right
// Rows 4–11: additional animations (TBD)
//
// Frame index formula: row * 8 + col
export const PLAYER_SHEET = {
  frameWidth:   96,
  frameHeight:  115,
  cols:         8,
  rows:         12,
  // At 0.5× → 48×57.5 px per frame on canvas; visible character ~42px tall
  displayScale: 0.5,
} as const;

// ─── Indoor tileset (shopping_indoor_assets.png) ─────────────────────────────
// 1376×768 px. Identified as a GBA-style corridor tileset ("Unicenter Corridor").
// 32 px base tile assumed (1376/32=43 cols, 768/32=24 rows divides cleanly; the
// individual prop sprites at the bottom row are each ~2-3 tiles wide at 32 px).
export const INDOOR_TILESET = {
  tileWidth:  32,
  tileHeight: 32,
  cols:       43,  // 1376 / 32
  rows:       24,  // 768  / 32
} as const;

// ─── Mall foreground depth-sort zones ────────────────────────────────────────
// Each zone is a rectangle (canvas coords, 480×320) that gets rendered TWICE:
// once at depth -1 (behind everything) as part of the normal background, and
// once at depth 5 (in front of the player at depth 4) when player.y < zone
// centerY — giving a Y-sort illusion for plants and columns baked into the bg.
// Positions derived from shopping_entrance.png (1376×768) → scale 0.349×0.417.
// FG image has transparent background so zone precision is not critical —
// only plant/column pixels are visible even if the rectangle is slightly larger.
// centerY overrides the zone midpoint for the depth-switch threshold.
// Increase it to make the switch happen lower (player must go further down
// before the element pops in front).
export const MALL_FOREGROUND_ZONES: Array<{ x: number; y: number; w: number; h: number; centerY?: number }> = [
  { x: 135, y: 165, w: 70, h: 90,  centerY: 230 }, // palm bottom-left
  { x: 275, y: 165, w: 70, h: 90,  centerY: 230 }, // palm bottom-right
  { x:   0, y:  80, w: 60, h: 200, centerY: 410 }, // columns left
  { x: 420, y:  80, w: 60, h: 200, centerY: 410 }, // columns right
  { x: 100, y:  55, w: 70, h: 90  },               // palms upper-left cluster
  { x: 310, y:  55, w: 70, h: 90  },               // palms upper-right cluster
];

// ─── Scene background images ─────────────────────────────────────────────────
// All scene images are 1376×768 — complete top-down illustrations, not tile sheets.
// Scale both axes to fit the 480×320 game canvas.
export const SCENE_SRC_W = 1376;
export const SCENE_SRC_H = 768;
export const GAME_W      = 480;
export const GAME_H      = 320;
