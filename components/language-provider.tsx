"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";

type Copy = {
  product: string;
  docs: string;
  plugins: string;
  github: string;
  search: string;
  language: string;
  menu: string;
};

const copy: Record<Language, Copy> = {
  en: {
    product: "Product",
    docs: "Docs",
    plugins: "Plugins",
    github: "GitHub",
    search: "Search docs",
    language: "中文",
    menu: "Documentation navigation",
  },
  zh: {
    product: "产品",
    docs: "文档",
    plugins: "插件",
    github: "GitHub",
    search: "搜索文档",
    language: "EN",
    menu: "文档导航",
  },
};

const LanguageContext = createContext<{
  language: Language;
  copy: Copy;
  toggleLanguage: () => void;
}>({
  language: "en",
  copy: copy.en,
  toggleLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const preference = window.localStorage.getItem("turboism-interface-language");
    const preferredLanguage =
      preference === "en" || preference === "zh"
        ? preference
        : navigator.language.toLowerCase().startsWith("zh")
          ? "zh"
          : "en";

    const timer = window.setTimeout(() => setLanguage(preferredLanguage), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleLanguage() {
    const nextLanguage = language === "en" ? "zh" : "en";
    window.localStorage.setItem("turboism-interface-language", nextLanguage);
    setLanguage(nextLanguage);
  }

  return (
    <LanguageContext.Provider value={{ language, copy: copy[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
