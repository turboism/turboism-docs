import { notFound, redirect } from "next/navigation";
import { isLanguage } from "@/lib/i18n";

export default async function LegacyNestedDocsRedirect({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  redirect(`/${lang}${slug?.length ? `/${slug.join("/")}` : ""}`);
}
