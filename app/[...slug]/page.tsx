import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DocumentationShell } from "@/components/docs-browser";
import { documents, getDocument } from "@/lib/content";

export function generateStaticParams() {
  return documents.map((document) => ({ slug: document.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const document = getDocument(slug.join("/"));

  if (!document) return {};

  return {
    title: document.title,
    description: document.description,
    alternates: { canonical: `/${document.slug}` },
  };
}

export default async function DocumentationPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const document = getDocument(slug.join("/"));

  if (!document) notFound();

  return (
    <DocumentationShell activeSlug={document.slug}>
      <article className="doc-article">
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Documentation</Link>
        <p className="eyebrow">{document.section}</p>
        <h1>{document.title}</h1>
        <p className="article-description">{document.description}</p>
        <div className="article-content">{document.content}</div>
        <footer className="article-footer">
          <span>{document.updated}</span>
          <a href="https://github.com/turboism/turboism-docs/issues/new" target="_blank" rel="noreferrer">Suggest an improvement</a>
        </footer>
      </article>
    </DocumentationShell>
  );
}
