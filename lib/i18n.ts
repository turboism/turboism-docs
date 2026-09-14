import { persistLanguagePreference } from '@/brand/language-preference.mjs';
import { defineI18n } from "fumadocs-core/i18n";

export const languages = ['en', 'zh', 'ja', 'ko'] as const;
export type Language = (typeof languages)[number];

export const LANGUAGE_COOKIE = "turboism-language";
export const LANGUAGE_STORAGE_KEY = LANGUAGE_COOKIE;
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: [...languages],
  fallbackLanguage: "en",
  hideLocale: "never",
  parser: "dot",
});

export function isLanguage(value: string | null | undefined): value is Language {
  return languages.includes(value as Language);
}

export function persistLanguage(language: Language): void {
  persistLanguagePreference(language);
}
