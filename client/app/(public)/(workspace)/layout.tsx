import type { ReactNode } from "react";
import Link from "next/link";
export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-5 py-8 sm:px-8">
      <nav aria-label="Project navigation" className="mb-10 border-b pb-5">
        <Link className="text-sm hover:underline" href="/#projects">
          ← Back to portfolio
        </Link>
      </nav>
      {children}
    </main>
  );
}
