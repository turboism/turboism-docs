import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { i18n, isLanguage, LANGUAGE_COOKIE } from "@/lib/i18n";

export default async function HomeRedirect() {
  const savedLanguage = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  const language = isLanguage(savedLanguage) ? savedLanguage : i18n.defaultLanguage;
  redirect(`/${language}`);
}
