import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-(family-name:--font-oswald) text-7xl font-bold text-[#ccff00]">
        404
      </p>
      <h1 className="mt-2 font-(family-name:--font-oswald) text-2xl font-bold uppercase">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-[#ccff00] px-5 py-3 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110"
      >
        Back to workouts
      </Link>
    </section>
  );
}