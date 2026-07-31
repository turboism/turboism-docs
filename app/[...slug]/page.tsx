import { notFound, redirect } from "next/navigation";

export default async function LegacyDocsRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug.length) {
    notFound();
  }

  redirect(`/docs/${slug.join("/")}`);
}
