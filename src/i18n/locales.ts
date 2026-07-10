export const locales = ['pl', 'en', 'de', 'cs', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

// Native names shown in the language switcher
export const localeNames: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
  de: 'Deutsch',
  cs: 'Čeština',
  fr: 'Français',
};

// BCP 47 tags used for hreflang / og:locale
export const localeTags: Record<Locale, string> = {
  pl: 'pl-PL',
  en: 'en-US',
  de: 'de-DE',
  cs: 'cs-CZ',
  fr: 'fr-FR',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
