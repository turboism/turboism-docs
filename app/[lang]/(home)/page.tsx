"use client";

import { ArrowRight, Blocks, BookOpen } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

const audienceLinks = [
  { key: "use", href: "/use/overview", title: "useTurboismTitle", description: "useTurboismDescription", icon: BookOpen },
  { key: "plugin", href: "/build-a-plugin/overview", title: "buildPluginTitle", description: "buildPluginDescription", icon: Blocks },
] as const;

type Copy = ReturnType<typeof useLanguage>["copy"];

export default function HomePage() {
  const { language, copy } = useLanguage();

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-12 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            {copy.home.eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-5xl">
            {copy.home.title}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">{copy.home.description}</p>
        </div>

        <div className="grid gap-6 min-[1410px]:grid-cols-2">
          {audienceLinks.map((audience) => {
            const href = `/${language}${audience.href}`;
            const Icon = audience.icon;
            return (
              <Link
                key={audience.key}
                href={href}
                className="group flex min-h-48 flex-col items-start justify-between gap-6 rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur transition-[background-color,border-color,box-shadow] hover:border-blue-300 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <Icon className="size-6" />
                </span>
                <span className="flex flex-col items-start gap-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 min-[1410px]:whitespace-nowrap">
                    {copy.home[audience.title as keyof Copy["home"]]}
                  </span>
                  <span className="text-base leading-relaxed text-slate-600 min-[1410px]:whitespace-nowrap">
                    {copy.home[audience.description as keyof Copy["home"]]}
                  </span>
                </span>
                <span className="flex min-h-11 items-center gap-2 font-semibold text-blue-600">
                  {copy.home.learnMore}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
