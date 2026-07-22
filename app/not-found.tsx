import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>That document is not here.</h1>
      <p>It may not have been published yet, or the link may be out of date.</p>
      <Link href="/">Return to documentation</Link>
    </main>
  );
}
