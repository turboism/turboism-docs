import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { SidebarTrigger } from "fumadocs-ui/layouts/docs/slots/sidebar";
import { PanelLeft } from "lucide-react";
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
    <DocsPage
      full={page.data.full}
      toc={page.data.toc}
      className="rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur-md"
      tableOfContent={{ container: { className: "border-s border-slate-200/60 bg-white/50 backdrop-blur-md" } }}
    >
      <SidebarTrigger className="flex size-11 items-center justify-center self-start rounded-lg border border-slate-200/70 bg-white/70 text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white/90 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:hidden">
        <PanelLeft className="size-5" />
      </SidebarTrigger>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="[&_a]:text-blue-600">
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}
