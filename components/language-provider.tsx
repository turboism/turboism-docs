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
    contact: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    useTurboismTitle: string;
    useTurboismDescription: string;
    buildPluginTitle: string;
    buildPluginDescription: string;
    learnMore: string;
  };
};

const copy: Record<Language, Copy> = {
  en: {
    language: "English",
    nav: { home: "Home", docs: "Docs", download: "Download", plugins: "Plugins", learn: "Learn", chat: "Chat", github: "GitHub", contact: "Contact" },
    home: {
      eyebrow: "Turboism / Documentation",
      title: "Build with a clearer boundary.",
      description:
        "The home for Turboism product and developer documentation — structured for the people using the framework and the people extending it.",
      useTurboismTitle: "I'm a user",
      useTurboismDescription: "Install Turboism and manage local JAR plugins.",
      buildPluginTitle: "I'm a developer",
      buildPluginDescription: "Build SDK-only Cubism plugins with Java 17 and the Preview SDK.",
      learnMore: "Learn more",
    },
  },
  zh: {
    language: "简体中文",
    nav: { home: "首页", docs: "文档", download: "下载", plugins: "插件", learn: "学习", chat: "聊天", github: "GitHub", contact: "联系我们" },
    home: {
      eyebrow: "Turboism / 文档",
      title: "在更清晰的边界上构建。",
      description: "Turboism 产品和开发者文档中心，为框架使用者与插件开发者提供完整指引。",
      useTurboismTitle: "我是普通用户",
      useTurboismDescription: "安装 Turboism，并管理本地 JAR 插件。",
      buildPluginTitle: "我是开发者",
      buildPluginDescription: "使用 Java 17 与 Preview SDK 构建 SDK-only Cubism 插件。",
      learnMore: "了解更多",
    },
  },
  ja: {
    language: "日本語",
    nav: { home: "ホーム", docs: "ドキュメント", download: "ダウンロード", plugins: "プラグイン", learn: "学ぶ", chat: "チャット", github: "GitHub", contact: "お問い合わせ" },
    home: {
      eyebrow: "Turboism / ドキュメント",
      title: "より明確な境界で構築する。",
      description:
        "Turboism の製品・開発者向けドキュメント。フレームワークの利用者とプラグイン開発者向けに整理されています。",
      useTurboismTitle: "一般ユーザーです",
      useTurboismDescription: "Turboism を導入し、ローカル JAR プラグインを管理します。",
      buildPluginTitle: "開発者です",
      buildPluginDescription: "Java 17 と Preview SDK で SDK 専用 Cubism プラグインを開発します。",
      learnMore: "詳しく見る",
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
