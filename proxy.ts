import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { NextRequest, NextResponse } from "next/server";
import { i18n, isLanguage, LANGUAGE_COOKIE } from "@/lib/i18n";

const handleI18n = createI18nMiddleware(i18n);

export default function proxy(request: NextRequest, context: Parameters<typeof handleI18n>[1]) {
  const segments = request.nextUrl.pathname.split("/");
  if (isLanguage(segments[1])) return handleI18n(request, context);

  const savedLanguage = request.cookies.get(LANGUAGE_COOKIE)?.value;
  if (!isLanguage(savedLanguage)) return handleI18n(request, context);

  const url = request.nextUrl.clone();
  url.pathname = `/${savedLanguage}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
