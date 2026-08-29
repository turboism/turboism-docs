import { defineI18n } from "fumadocs-core/i18n";

export const languages = ["en", "zh", "ja"] as const;
export type Language = (typeof languages)[number];

export const LANGUAGE_COOKIE = "turboism-language";
export const LANGUAGE_STORAGE_KEY = LANGUAGE_COOKIE;
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: [...languages],
  fallbackLanguage: null,
  hideLocale: "never",
  parser: "dot",
});

export function isLanguage(value: string | null | undefined): value is Language {
  return languages.includes(value as Language);
}

export function persistLanguage(language: Language): void {
  if (typeof window === "undefined") return;

  const sharedDomain = window.location.hostname.endsWith(".turboism.dev")
    ? "; Domain=.turboism.dev"
    : "";
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax${sharedDomain}${secure}`;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Cookies remain the cross-subdomain source of truth when storage is unavailable.
  }
}
