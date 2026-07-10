import { pl } from './locales/pl';
import { en } from './locales/en';
import { de } from './locales/de';
import { cs } from './locales/cs';
import { fr } from './locales/fr';
import type { Dictionary } from './dictionary';
import { type Locale, defaultLocale } from './locales';

export * from './locales';
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { pl, en, de, cs, fr };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[(locale as Locale)] ?? dictionaries[defaultLocale];
}
