import { uiTranslations, i18nProvider } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n, type Language } from "@/lib/i18n";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    zh: {
      displayName: "简体中文",
      "Search(search trigger)": "搜索文档",
      "Search(search dialog)": "搜索",
      "No results found(search dialog)": "未找到结果",
      "On this page(table of contents)": "本页目录",
      "Previous Page(pagination)": "上一页",
      "Next Page(pagination)": "下一页",
      "Choose a language(language switcher)": "选择语言",
      "Choose a language(language switcher)(aria-label)": "选择语言",
    },
    ja: {
      displayName: "日本語",
      "Search(search trigger)": "ドキュメントを検索",
      "Search(search dialog)": "検索",
      "No results found(search dialog)": "結果が見つかりません",
      "On this page(table of contents)": "このページ",
      "Previous Page(pagination)": "前のページ",
      "Next Page(pagination)": "次のページ",
      "Choose a language(language switcher)": "言語を選択",
      "Choose a language(language switcher)(aria-label)": "言語を選択",
    },
  });

export function providerOptions(language: Language) {
  return i18nProvider(translations, language);
}

export function baseOptions(language: Language): BaseLayoutProps {
  return {
    nav: { title: "Turboism Docs", url: `/${language}` },
    githubUrl: "https://github.com/turboism/turboism-docs",
  };
}
