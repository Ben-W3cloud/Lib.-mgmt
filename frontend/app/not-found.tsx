import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid place-items-center gap-6 px-4 py-32 text-center md:py-44">
      <p className="eyebrow">[ Error 404 ]</p>
      <h1 className="font-doto text-[clamp(4rem,18vw,9rem)] font-semibold leading-none text-[var(--display)]">
        404
      </h1>
      <p className="max-w-[46ch] text-sm leading-6 text-[var(--muted)] md:text-base">
        This page was never written to the chain. The catalog, however, is exactly where you left it.
      </p>
      <Link href="/" className="btn-primary">
        Back to the folio
      </Link>
    </div>
  );
}
