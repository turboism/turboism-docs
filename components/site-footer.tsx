"use client";

import Link from "next/link";

export function SiteFooter() {
  const links = [
    { title: "contact@turboism.dev", href: "mailto:contact@turboism.dev" },
    { title: "Discord", href: "https://discord.gg/bect4anknH" },
  ];

  return (
    <footer className="relative z-10 border-t border-white/20 bg-white/20 backdrop-blur-sm pt-12 mb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-sm text-slate-500/80">
            <Link href="https://turboism.dev" className="font-sans font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Turboism
            </Link>
            <span className="text-slate-300">|</span>
            <span className="font-light">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-500/80">
            {links.map((link) => (
              <a key={link.title} href={link.href} className="transition-colors hover:text-slate-900">
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
