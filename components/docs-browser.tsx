"use client";

import Link from "next/link";
import { ChevronRight, FileText, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { documentSections, documents, getDocumentsForSection, type DocumentPage } from "@/lib/content";
import { SearchButton } from "@/components/site-shell";

export function DocumentationSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="docs-sidebar" aria-label="Documentation sections">
      {documentSections.map((section) => (
        <section key={section} className="sidebar-section">
          <h2>{section}</h2>
          {getDocumentsForSection(section).map((document) => (
            <Link
              className={document.slug === activeSlug ? "active" : undefined}
              href={`/${document.slug}`}
              key={document.slug}
            >
              {document.title}
            </Link>
          ))}
        </section>
      ))}
    </nav>
  );
}

export function DocumentationShell({
  children,
  activeSlug,
}: {
  children: React.ReactNode;
  activeSlug?: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="docs-layout">
        <aside>
          <DocumentationSidebar activeSlug={activeSlug} />
        </aside>
        <main className="docs-main">
          <div className="docs-toolbar">
            <SearchButton onClick={() => setSearchOpen(true)} />
          </div>
          {children}
        </main>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDocuments(query), [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Escape") onClose();
    }

    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search documentation">
      <div className="search-dialog">
        <div className="search-input-row">
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the English documentation"
          />
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="search-results">
          {results.map((document) => (
            <Link href={`/${document.slug}`} key={document.slug} onClick={onClose} className="search-result">
              <FileText size={16} />
              <span>
                <strong>{document.title}</strong>
                <small>{document.description}</small>
              </span>
              <ChevronRight size={16} />
            </Link>
          ))}
          {results.length === 0 && <p className="empty-search">No matching documentation page.</p>}
        </div>
      </div>
    </div>
  );
}

function searchDocuments(query: string): DocumentPage[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return documents;

  return documents.filter((document) =>
    `${document.title} ${document.description} ${document.section}`.toLowerCase().includes(normalized)
  );
}
