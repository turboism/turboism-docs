import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-medium text-fd-primary">404</p>
      <h1 className="text-2xl font-semibold text-fd-foreground">That document is not here.</h1>
      <p className="text-sm text-fd-muted-foreground">
        It may not have been published yet, or the link may be out of date.
      </p>
      <Link href="/" className="text-sm font-medium text-fd-primary underline-offset-4 hover:underline">
        Return to documentation
      </Link>
    </main>
  );
}
