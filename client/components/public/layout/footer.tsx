import Link from "next/link";
import { Mail } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t bg-muted/30 px-4 text-xs text-muted-foreground">
      <div className="container flex flex-col gap-6 py-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Workspace
          </p>

          <div className="flex items-center gap-6 font-mono text-sm">

            <span className="text-muted-foreground">
              v1.0.0
            </span>

            <span className="text-emerald-500">
              ● Ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="https://github.com"
            target="_blank"
          >
            <FaGithub className="size-5 transition-colors hover:text-primary" />
          </Link>

          <Link
            href="https://linkedin.com"
            target="_blank"
          >
            <FaLinkedin className="size-5 transition-colors hover:text-primary" />
          </Link>

          <Link href="mailto:you@example.com">
            <Mail className="size-5 transition-colors hover:text-primary" />
          </Link>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Han Li
        </p>
      </div>
    </footer>
  );
}