"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "es";

const STRINGS = {
  en: {
    subtitle: "Interactive Curriculum Vitae",
    move: "⬆⬇⬅➡ / WASD: move",
    interact: "SPACE: interact",
    exit: "ESC: exit shop",
    lang: "[L] switch language (EN/ES)",
    reset: "[R] reset captured skills",
  },
  es: {
    subtitle: "Currículum Vitae Interactivo",
    move: "⬆⬇⬅➡ / WASD: mover",
    interact: "ESPACIO: interactuar",
    exit: "ESC: salir de tienda",
    lang: "[L] cambiar idioma (EN/ES)",
    reset: "[R] resetear skills capturadas",
  },
};

function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("mae_cv_lang") as Lang | null;
    if (stored) setLang(stored);

    const handler = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener("mae_cv_langchange", handler);
    return () => window.removeEventListener("mae_cv_langchange", handler);
  }, []);

  return lang;
}

export function PageSubtitle({ title }: { title: string }) {
  const lang = useLang();
  return (
    <p className="text-center font-mono text-gray-400 text-xs mb-4">
      {title} &middot; {STRINGS[lang].subtitle}
    </p>
  );
}

export function PageControls() {
  const lang = useLang();
  const s = STRINGS[lang];
  return (
    <div className="mt-4 font-mono text-gray-500 text-xs text-center space-x-4">
      <span>{s.move}</span>
      <span>&nbsp;·&nbsp; {s.interact}</span>
      <span>&nbsp;·&nbsp; {s.exit}</span>
      <span>&nbsp;·&nbsp; <kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded">L</kbd> {s.lang}</span>
      <span>&nbsp;·&nbsp; <kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 rounded">R</kbd> {s.reset}</span>
    </div>
  );
}
