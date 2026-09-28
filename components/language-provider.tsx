"use client";

import { createContext, useContext, useEffect } from "react";
import { persistLanguage, type Language } from "@/lib/i18n";

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
  ko: {"language":"한국어","nav":{"home":"홈","docs":"문서","download":"다운로드","plugins":"플러그인","learn":"튜토리얼","chat":"채팅","github":"GitHub","contact":"문의"},"home":{"eyebrow":"Turboism / 문서","title":"더 명확한 경계 위에서 개발하세요.","description":"Turboism의 기본 사용법과 개발 문서입니다.","useTurboismTitle":"기본 사용법","useTurboismDescription":"Turboism 설치와 사용, 플러그인 관리, 업데이트, 복구 및 제거 방법을 알아보세요.","buildPluginTitle":"개발","buildPluginDescription":"Turboism에 기여하거나 Java 플러그인, GraalJS 및 MCP로 개발하세요.","learnMore":"자세히 보기"}},

  en: {
    language: "English",
    nav: { home: "Home", docs: "Docs", download: "Download", plugins: "Plugins", learn: "Learn", chat: "Chat", github: "GitHub", contact: "Contact" },
    home: {
      eyebrow: "Turboism / Documentation",
      title: "Build with a clearer boundary.",
      description:
        "Turboism documentation for basic use and development.",
      useTurboismTitle: "Basics",
      useTurboismDescription: "Install and use Turboism, manage plugins, update, recover, or uninstall.",
      buildPluginTitle: "Development",
      buildPluginDescription: "Contribute to Turboism or develop with Java plugins, GraalJS, and MCP.",
      learnMore: "Learn more",
    },
  },
  zh: {
    language: "简体中文",
    nav: { home: "首页", docs: "文档", download: "下载", plugins: "插件", learn: "学习", chat: "聊天", github: "GitHub", contact: "联系我们" },
    home: {
      eyebrow: "Turboism / 文档",
      title: "在更清晰的边界上构建。",
      description: "Turboism 的基本使用与开发文档。",
      useTurboismTitle: "基本",
      useTurboismDescription: "安装和使用 Turboism，管理插件，并完成更新、恢复或卸载。",
      buildPluginTitle: "开发",
      buildPluginDescription: "参与 Turboism 开发，或使用 Java 插件、GraalJS 与 MCP。",
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
        "Turboism の基本利用と開発に関するドキュメントです。",
      useTurboismTitle: "基本",
      useTurboismDescription: "Turboism のインストールと利用、プラグイン管理、更新、復旧、削除を確認します。",
      buildPluginTitle: "開発",
      buildPluginDescription: "Turboism への貢献、または Java プラグイン、GraalJS、MCP を使った開発を確認します。",
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
  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, copy: copy[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
