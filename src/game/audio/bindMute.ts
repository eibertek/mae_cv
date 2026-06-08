import { SoundManager } from "./SoundManager";

/**
 * Listens for the global "mae_cv_mute" CustomEvent and forwards
 * the muted state to the given SoundManager.
 * Returns a cleanup function — call it on scene SHUTDOWN.
 */
export function bindMuteEvent(sfx: SoundManager): () => void {
  const handler = (e: Event) => sfx.setMuted((e as CustomEvent<boolean>).detail);
  window.addEventListener("mae_cv_mute", handler);
  return () => window.removeEventListener("mae_cv_mute", handler);
}
