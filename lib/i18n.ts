import { defineI18n } from "fumadocs-core/i18n";

export const languages = ["en", "zh", "ja"] as const;
export type Language = (typeof languages)[number];

export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: [...languages],
  fallbackLanguage: null,
  hideLocale: "never",
  parser: "dot",
});

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
