import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, TerminalSquare } from "lucide-react";
import { DocumentationShell } from "@/components/docs-browser";

export default function HomePage() {
  return (
    <DocumentationShell>
      <article className="doc-article home-article">
        <p className="eyebrow">Turboism / Documentation</p>
        <h1>Build with a clearer boundary.</h1>
        <p className="lede">
          The home for Turboism product and developer documentation—structured for
          the people using the framework and the people extending it.
        </p>
        <div className="preview-callout">
          <span>Documentation preview</span>
          <p>
            Release facts, public API contracts, compatibility records, and
            installation instructions will be added only when they can be tied to a
            versioned public release.
          </p>
        </div>
        <section className="path-grid" aria-label="Documentation paths">
          <Link href="/use/overview" className="path-card">
            <TerminalSquare size={22} />
            <div>
              <h2>Use Turboism</h2>
              <p>Follow availability, setup, and verification guidance when it is published.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link href="/build-a-plugin/overview" className="path-card">
            <Boxes size={22} />
            <div>
              <h2>Build a Plugin</h2>
              <p>Understand the future extension path without guessing at an API contract.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </section>
        <section className="home-section">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Concepts that travel with the product.</h2>
          </div>
          <div className="link-list">
            <Link href="/introduction"><BookOpen size={16} /> Introduction <ArrowRight size={15} /></Link>
            <Link href="/concepts/architecture"><BookOpen size={16} /> Architecture <ArrowRight size={15} /></Link>
            <Link href="/documentation-preview"><BookOpen size={16} /> Documentation preview <ArrowRight size={15} /></Link>
          </div>
        </section>
      </article>
    </DocumentationShell>
  );
}
