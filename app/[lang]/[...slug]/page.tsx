import { notFound, redirect } from "next/navigation";
import { isLanguage } from "@/lib/i18n";

export default async function LegacyDocsRedirect({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang) || !slug.length) notFound();
  redirect(`/${lang}/docs/${slug.join("/")}`);
}
