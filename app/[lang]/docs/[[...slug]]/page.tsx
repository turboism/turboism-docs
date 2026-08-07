import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { source } from "@/lib/source";
import { isLanguage } from "@/lib/i18n";

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) return {};
  const page = source.getPage(slug ?? [], lang);
  if (!page) return {};

  const canonical = page.url;
  const path = `/${lang}/docs${slug?.length ? `/${slug.join("/")}` : ""}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical,
      languages: {
        en: path.replace(`/${lang}/`, "/en/"),
        zh: path.replace(`/${lang}/`, "/zh/"),
        ja: path.replace(`/${lang}/`, "/ja/"),
      },
    },
  };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const page = source.getPage(slug ?? [], lang);
  if (!page) notFound();

  const MDX = page.data._exports.default as ComponentType;

  return (
    <DocsPage full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}
