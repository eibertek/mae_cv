import { EN } from "../i18n/en";
import { ES } from "../i18n/es";

export type Lang = "en" | "es";

let _lang: Lang = "en";

export const getLang = (): Lang => _lang;
export const setLang  = (l: Lang) => { _lang = l; };
export const toggleLang = () => { _lang = _lang === "en" ? "es" : "en"; };

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
