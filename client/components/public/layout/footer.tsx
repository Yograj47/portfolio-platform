import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
        <div>
          <h3 className="font-semibold">
            Han Li
          </h3>

          <p className="text-sm text-muted-foreground">
            Building modern web applications with
            Next.js & NestJS.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="https://github.com"
            target="_blank"
          >
            <FaGithub className="size-5 transition hover:text-primary" />
          </Link>

          <Link
            href="https://linkedin.com"
            target="_blank"
          >
            <FaLinkedin className="size-5 transition hover:text-primary" />
          </Link>

          <Link href="mailto:you@example.com">
            <Mail className="size-5 transition hover:text-primary" />
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Han Li. All rights reserved.
        </p>
      </div>
    </footer>
  );
}