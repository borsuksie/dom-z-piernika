import { pl } from './pl';
import { en } from './en';
import { de } from './de';
import { cs } from './cs';
import { fr } from './fr';
import type { GuideDictionary } from './types';
import { type Locale, defaultLocale } from '../locales';

export type { GuideDictionary, PoiCopy } from './types';

const guideDictionaries: Record<Locale, GuideDictionary> = { pl, en, de, cs, fr };

export function getGuideDictionary(locale: string): GuideDictionary {
  return guideDictionaries[(locale as Locale)] ?? guideDictionaries[defaultLocale];
}
