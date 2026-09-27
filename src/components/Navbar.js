"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlan } from "../context/PlanContext";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  const links = [
    { href: "/", label: "Workouts" },
    { href: "/my-plan", label: "My Plan" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FitLog logo"
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain"
          />
          <span className="font-(family-name:--font-oswald) text-lg font-bold tracking-wide">
            FITLOG
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                  active
                    ? "bg-[#2a3300] text-[#ccff00]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 text-gray-300"
          >
            <span className="hidden sm:inline">Plan</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ccff00] px-1.5 text-xs font-bold text-black">
              {plan.length}
            </span>
          </Link>
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 text-gray-300"
          >
            <span className="hidden sm:inline">Saved</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-white/40 px-1.5 text-xs font-bold text-white">
              {saved.length}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}