export const ES: Record<string, string> = {
  // ── MallScene ──────────────────────────────────────────────────────────────
  "mall.hud":          "Skills: {captured}/{total}  ·  WASD/flechas: mover  ·  ESPACIO: interactuar",
  "mall.welcome":      "¡Bienvenido al Mall de {name}! Usá flechas/WASD para moverte.",
  "mall.entering":     "Entrando a {label}...",
  "mall.lang_toggle":  "[L] EN",
  "zone.knowledge":    "HABILIDADES\n[ ENTRAR ]",
  "zone.work":         "EXPERIENCIA\n[ ENTRAR ]",

  // ── KnowledgeShopScene ────────────────────────────────────────────────────
  "knowledge.title":         "🎮 TIENDA DE HABILIDADES",
  "knowledge.subtitle":      "Capturá las skills de Mariano  |  ESC = Salir",
  "knowledge.captured":      "Capturados: {captured} / {total}",
  "knowledge.reset":         "[R] Reset",
  "knowledge.reset_confirm": "¿Resetear todas las skills?",
  "knowledge.reset_hint":    "[R / ENTER] Confirmar   [ESC] Cancelar",
  "knowledge.reset_done":    "Skills reseteadas",

  // ── WorkShopScene ─────────────────────────────────────────────────────────
  "work.title":    "💼 TIENDA DE EXPERIENCIA",
  "work.subtitle": "Acercate a las vitrinas y presioná ESPACIO  |  ESC = Salir",
  "work.recent":   "— Reciente",
  "work.history":  "— Historia",

  // ── BattleScene ───────────────────────────────────────────────────────────
  "battle.appeared":     "¡Un {name} salvaje apareció!",
  "battle.fight":        "⚔ LUCHAR",
  "battle.capture":      "🎯 CAPTURAR",
  "battle.run":          "🏃 HUIR",
  "battle.player_card":  "MARIANO",
  "battle.commit":       "¡Mariano usó \"Commit Push\"!\n¡Causó {dmg} de daño!",
  "battle.counterattack":"¡{name} contraatacó!\n¡Hizo {eDmg} de daño! (HP: {current}/{max})",
  "battle.too_strong":   "¡{name} tiene demasiada energía!\nReducí sus HP al 30% para capturarlo.",
  "battle.captured":     "¡{name} fue capturado!\n✅ Añadido a tus habilidades.",
  "battle.escaped_ball": "¡{name} escapó de la Skillsball!\n¡Seguí intentando!",
  "battle.defeated":     "¡{name} fue derrotado!\n(Intentá capturarlo antes de derrotarlo)",
  "battle.ran":          "¡Te retiraste de la batalla!",

  // ── DialogScene ───────────────────────────────────────────────────────────
  "dialog.advance":   "▼ ESPACIO",
  "dialog.open_hint": "[ESPACIO] Abrir  ·  [ESC] Cerrar",
};
