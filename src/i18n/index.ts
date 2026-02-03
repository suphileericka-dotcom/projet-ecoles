import fr from "./fr";
import en from "./en";
import es from "./es";
import de from "./de";
import it from "./it";

/**
 * Type d’un dictionnaire de traduction
 */
export type TranslationDict = Record<string, string>;

/**
 * Toutes les traductions disponibles
 */
const translations: Record<string, TranslationDict> = {
  fr,
  en,
  es,
  de,
  it,
};

/**
 * Traduction simple par clé
 */
export function translate(key: string, lang: string): string {
  const dict = translations[lang] ?? translations.fr;
  return dict[key] ?? key;
}
