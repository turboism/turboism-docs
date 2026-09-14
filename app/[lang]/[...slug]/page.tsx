import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { SidebarTrigger } from "fumadocs-ui/layouts/docs/slots/sidebar";
import { PanelLeft } from "lucide-react";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";
import { isLanguage } from "@/lib/i18n";

export function generateStaticParams() {
  return source.generateParams().filter((params) => params.slug?.length);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) return {};
  const page = source.getPage(slug, lang);
  if (!page) return {};

  const path = `/docs/${lang}/${slug.join("/")}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `/docs${page.url}`,
      languages: {
        en: path.replace(`/docs/${lang}/`, "/docs/en/"),
        zh: path.replace(`/docs/${lang}/`, "/docs/zh/"),
        ja: path.replace(`/docs/${lang}/`, "/docs/ja/"),
      },
    },
  };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data._exports.default as ComponentType<{
    components?: MDXComponents;
  }>;

  return (
    <DocsPage
      full={page.data.full}
      toc={page.data.toc}
      className="rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur-md"
      tableOfContent={{ container: { className: "border-s border-slate-200/60 bg-white/50 backdrop-blur-md" } }}
    >
      <SidebarTrigger className="flex size-11 items-center justify-center self-start rounded-lg border border-slate-200/70 bg-white/70 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white/90 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:hidden">
        <PanelLeft className="size-5" />
      </SidebarTrigger>
      {lang === "ko" && !/\.ko\.mdx?$/.test(page.path) && <p role="note" data-language-fallback="en" lang="ko">이 문서의 한국어 번역은 아직 제공되지 않아 영어 원문을 표시합니다.</p>}
      <DocsTitle className="text-blue-600">{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody lang={lang === "ko" && !/\.ko\.mdx?$/.test(page.path) ? "en" : lang} className="[&_a]:text-blue-600">
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
