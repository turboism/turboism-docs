"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";

const networks = [
  { key: "product", href: "https://www.turboism.dev" },
  { key: "docs", href: "https://docs.turboism.dev" },
  { key: "plugins", href: "https://plugin.turboism.dev" },
  { key: "learn", href: "https://learn.turboism.dev" },
  { key: "chat", href: "https://chat.turboism.dev" },
  { key: "github", href: "https://github.com/turboism" },
] as const;

export function SiteHeader() {
  const { copy, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Turboism Docs home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>Turboism <em>Docs</em></span>
        </Link>
        <nav className="network-nav" aria-label="Turboism network">
          {networks.map((network) => (
            <a
              className={network.key === "docs" ? "is-active" : undefined}
              href={network.href}
              key={network.key}
              target={network.key === "github" ? "_blank" : undefined}
              rel={network.key === "github" ? "noreferrer" : undefined}
            >
              {copy[network.key]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="language-button" onClick={toggleLanguage} type="button">
            {copy.language}
          </button>
          <button className="icon-button" onClick={() => setOpen(!open)} type="button" aria-expanded={open} aria-label="Toggle navigation">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-network-nav" aria-label="Turboism network">
          {networks.map((network) => (
            <a href={network.href} key={network.key} target={network.key === "github" ? "_blank" : undefined} rel={network.key === "github" ? "noreferrer" : undefined}>
              {copy[network.key]}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  const { copy } = useLanguage();

  return (
    <button type="button" className="search-button" onClick={onClick}>
      <Search size={16} />
      <span>{copy.search}</span>
      <kbd>⌘K</kbd>
    </button>
  );
}

export function SiteFooter() {
  const { copy } = useLanguage();

  return (
    <footer className="site-footer">
      <div>
        <span className="footer-brand">Turboism Docs</span>
        <p>Documentation preview — English body content is authoritative.</p>
      </div>
      <div className="footer-links">
        <a href="https://www.turboism.dev">{copy.product}</a>
        <a href="https://plugin.turboism.dev">{copy.plugins}</a>
        <a href="https://github.com/turboism/turboism-docs">{copy.github}</a>
      </div>
    </footer>
  );
}
