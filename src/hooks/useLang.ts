import { t } from "../i18n";
import type { Lang } from "../i18n";

export function useLang() {
  const lang = (localStorage.getItem("language") || "fr") as Lang;

  return {
    lang,
    t: (key: string) => t(key, lang),
  };
}
