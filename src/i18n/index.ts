import fr from "./fr";
import en from "./en";
import es from "./es";
import de from "./de";
import it from "./it";

export const translations = {
  fr,
  en,
  es,
  de,
  it,
};

export type Lang = keyof typeof translations;

export function t(key: string, lang: Lang = "fr"): string {
  return translations[lang][key] ?? key;
}
