import { EN } from "../i18n/en";
import { ES } from "../i18n/es";

export type Lang = "en" | "es";

const LS_KEY = "mae_cv_lang";

function initLang(): Lang {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LS_KEY) as Lang | null) ?? "en";
}

let _lang: Lang = initLang();

export const getLang = (): Lang => _lang;

export const setLang = (l: Lang) => {
  _lang = l;
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, l);
    window.dispatchEvent(new CustomEvent("mae_cv_langchange", { detail: l }));
  }
};

export const toggleLang = () => setLang(_lang === "en" ? "es" : "en");

export const t = (key: string, vars?: Record<string, string | number>): string => {
  const map = _lang === "en" ? EN : ES;
  let str = map[key] ?? EN[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }
  return str;
};
