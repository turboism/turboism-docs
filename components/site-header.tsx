"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { ThanksStarLink } from "@/components/thanks-star-link";

const SDK_HREF = "https://turboism.dev/sdk/index.html";
const DOWNLOAD_HREF = "https://github.com/turboism/turboism/releases";
const GITHUB_HREF = "https://github.com/turboism";

export function SiteHeader() {
  const { language, copy } = useLanguage();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: copy.nav.home, href: "https://turboism.dev", current: false },
    { label: copy.nav.docs, href: `/${language}`, current: true },
    { label: "SDK", href: SDK_HREF, current: false },
    { label: copy.nav.plugins, href: "https://turboism.dev/plugins", current: false },
    { label: copy.nav.learn, href: "https://turboism.dev/learn", current: false },
    { label: copy.nav.chat, href: "https://chat.turboism.dev", current: false },
    { label: copy.nav.download, href: DOWNLOAD_HREF, current: false },
    { label: copy.nav.github, href: GITHUB_HREF, current: false },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/40 backdrop-blur-md">
      <div className="flex h-20 w-full items-center pl-4 pr-6">
        <div className="flex shrink-0 items-center">
          <Link
            href={`/${language}`}
            className="flex shrink-0 items-center font-sans text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-amber-400 bg-clip-text text-transparent"
          >
            Turboism
          </Link>
          <ThanksStarLink />
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 md:flex lg:gap-6">
          {navItems.map((item) =>
            item.current ? (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-3 md:flex">
          <LanguageSwitcher language={language} />
        </div>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="ml-auto flex size-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50/50 md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-white/20 bg-white/80 px-6 py-6 shadow-xl backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) =>
              item.current ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-semibold text-blue-600"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-slate-700 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ),
            )}
            <div className="my-2 h-px bg-slate-200/50" />
            <LanguageSwitcher language={language} />
          </nav>
        </div>
      )}
    </header>
  );
}
