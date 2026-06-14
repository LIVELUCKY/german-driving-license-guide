// Central i18n dictionary — add a locale by dropping a JSON file in src/i18n/
import en from '../i18n/en.json';
import de from '../i18n/de.json';
import ar from '../i18n/ar.json';

export const DICT = { en, de, ar };

export function makeT(lang) {
  const d = DICT[lang] ?? DICT.en;
  return (key) => d[key] ?? DICT.en[key] ?? key;
}
