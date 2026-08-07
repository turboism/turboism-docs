"use client";

import { createContext, useContext } from "react";
import type { Language } from "@/lib/i18n";

type Copy = {
  language: string;
  nav: {
    home: string;
    docs: string;
    download: string;
    plugins: string;
    learn: string;
    chat: string;
    github: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    useTurboismTitle: string;
    useTurboismDescription: string;
    buildPluginTitle: string;
    buildPluginDescription: string;
    sdkTitle: string;
    sdkDescription: string;
    startHere: string;
    introduction: string;
    architecture: string;
    documentationPreview: string;
  };
};

const copy: Record<Language, Copy> = {
  en: {
    language: "English",
    nav: { home: "Home", docs: "Docs", download: "Download", plugins: "Plugins", learn: "Learn", chat: "Chat", github: "GitHub" },
    home: {
      eyebrow: "Turboism / Documentation",
      title: "Build with a clearer boundary.",
      description:
        "The home for Turboism product and developer documentation — structured for the people using the framework and the people extending it.",
      useTurboismTitle: "Use Turboism",
      useTurboismDescription: "Install the Preview, verify startup, and manage local plugins safely.",
      buildPluginTitle: "Build a Plugin",
      buildPluginDescription: "Build Java 17 plugins against the current SDK-only contract.",
      sdkTitle: "SDK Reference",
      sdkDescription: "Browse the generated Java API reference for the current Turboism Preview SDK.",
      startHere: "Start here",
      introduction: "Introduction",
      architecture: "Architecture",
      documentationPreview: "Documentation preview",
    },
  },
  zh: {
    language: "简体中文",
    nav: { home: "首页", docs: "文档", download: "下载", plugins: "插件", learn: "学习", chat: "聊天", github: "GitHub" },
    home: {
      eyebrow: "Turboism / 文档",
      title: "在更清晰的边界上构建。",
      description: "Turboism 产品和开发者文档中心，为框架使用者与插件开发者提供完整指引。",
      useTurboismTitle: "使用 Turboism",
      useTurboismDescription: "安装 Preview、验证启动，并安全管理本地插件。",
      buildPluginTitle: "构建插件",
      buildPluginDescription: "依据当前仅面向 SDK 的契约构建 Java 17 插件。",
      sdkTitle: "SDK 参考",
      sdkDescription: "浏览当前 Turboism Preview SDK 自动生成的 Java API 文档。",
      startHere: "从这里开始",
      introduction: "简介",
      architecture: "架构",
      documentationPreview: "文档预览",
    },
  },
  ja: {
    language: "日本語",
    nav: { home: "ホーム", docs: "ドキュメント", download: "ダウンロード", plugins: "プラグイン", learn: "学ぶ", chat: "チャット", github: "GitHub" },
    home: {
      eyebrow: "Turboism / ドキュメント",
      title: "より明確な境界で構築する。",
      description:
        "Turboism の製品・開発者向けドキュメント。フレームワークの利用者とプラグイン開発者向けに整理されています。",
      useTurboismTitle: "Turboism を使う",
      useTurboismDescription: "Preview を導入し、起動を確認して、ローカルプラグインを安全に管理します。",
      buildPluginTitle: "プラグインを作る",
      buildPluginDescription: "現在の SDK 専用契約に基づいて Java 17 プラグインを構築します。",
      sdkTitle: "SDK リファレンス",
      sdkDescription: "現在の Turboism Preview SDK から生成された Java API ドキュメントを参照します。",
      startHere: "はじめに",
      introduction: "イントロダクション",
      architecture: "アーキテクチャ",
      documentationPreview: "ドキュメントプレビュー",
    },
  },
};

const LanguageContext = createContext<{ language: Language; copy: Copy }>({
  language: "en",
  copy: copy.en,
});

export function LanguageProvider({
  language,
  children,
}: {
  language: Language;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{ language, copy: copy[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
