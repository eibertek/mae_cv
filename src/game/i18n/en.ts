export const EN: Record<string, string> = {
  // ── MallScene ──────────────────────────────────────────────────────────────
  "mall.hud":          "Skills: {captured}/{total}  ·  WASD/arrows: move  ·  SPACE: interact",
  "mall.welcome":      "Welcome to {name}'s Mall! Use arrows/WASD to move.",
  "mall.entering":     "Entering {label}...",
  "mall.lang_toggle":  "[L] ES",
  "zone.knowledge":    "SKILLS\n[ ENTER ]",
  "zone.work":         "EXPERIENCE\n[ ENTER ]",

  // ── KnowledgeShopScene ────────────────────────────────────────────────────
  "knowledge.title":         "🎮 SKILLS SHOP",
  "knowledge.subtitle":      "Capture Mariano's skills  |  ESC = Exit",
  "knowledge.captured":      "Captured: {captured} / {total}",
  "knowledge.reset":         "[R] Reset",
  "knowledge.reset_confirm": "Reset all skills?",
  "knowledge.reset_hint":    "[R / ENTER] Confirm   [ESC] Cancel",
  "knowledge.reset_done":    "Skills reset",

  // ── WorkShopScene ─────────────────────────────────────────────────────────
  "work.title":    "💼 EXPERIENCE SHOP",
  "work.subtitle": "Walk to showcases and press SPACE  |  ESC = Exit",
  "work.recent":   "— Recent",
  "work.history":  "— History",

  // ── BattleScene ───────────────────────────────────────────────────────────
  "battle.appeared":     "A wild {name} appeared!",
  "battle.fight":        "⚔ FIGHT",
  "battle.capture":      "🎯 CAPTURE",
  "battle.run":          "🏃 RUN",
  "battle.player_card":  "MARIANO",
  "battle.commit":       "Mariano used \"Commit Push\"!\nDealt {dmg} damage!",
  "battle.counterattack":"The {name} counterattacked!\nDealt {eDmg} damage! (HP: {current}/{max})",
  "battle.too_strong":   "{name} has too much energy!\nReduce HP below 30% to capture it.",
  "battle.captured":     "{name} was captured!\n✅ Added to your skills.",
  "battle.escaped_ball": "{name} escaped the Skillsball!\nKeep trying!",
  "battle.defeated":     "{name} was defeated!\n(Try to capture before defeating it)",
  "battle.ran":          "You retreated from the battle!",

  // ── DialogScene ───────────────────────────────────────────────────────────
  "dialog.advance":   "▼ SPACE",
  "dialog.open_hint": "[SPACE] Open  ·  [ESC] Close",
};
