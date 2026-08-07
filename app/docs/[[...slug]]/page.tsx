import { redirect } from "next/navigation";

export default async function DefaultLanguageDocsRedirect({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  redirect(`/en/docs${slug?.length ? `/${slug.join("/")}` : ""}`);
}
