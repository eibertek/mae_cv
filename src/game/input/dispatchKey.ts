export const KEYS = {
  UP:    { code: "ArrowUp",    key: "ArrowUp",  keyCode: 38 },
  DOWN:  { code: "ArrowDown",  key: "ArrowDown",keyCode: 40 },
  LEFT:  { code: "ArrowLeft",  key: "ArrowLeft",keyCode: 37 },
  RIGHT: { code: "ArrowRight", key: "ArrowRight",keyCode: 39},
  SPACE: { code: "Space",      key: " ",        keyCode: 32 },
  ESC:   { code: "Escape",     key: "Escape",   keyCode: 27 },
} as const;

type KeyDef = (typeof KEYS)[keyof typeof KEYS];

export function keyDown(k: KeyDef) {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      code: k.code, key: k.key, keyCode: k.keyCode,
      which: k.keyCode, bubbles: true, cancelable: true,
    })
  );
}

export function keyUp(k: KeyDef) {
  window.dispatchEvent(
    new KeyboardEvent("keyup", {
      code: k.code, key: k.key, keyCode: k.keyCode,
      which: k.keyCode, bubbles: true,
    })
  );
}
