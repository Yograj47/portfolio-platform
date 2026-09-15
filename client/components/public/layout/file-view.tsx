import { ReactNode } from "react";

interface FileViewProps {
  children: ReactNode;
}

export function FileView({ children }: FileViewProps) {
  return (
    <section className="px-4 py-6 sm:px-8">
      <div className="w-full">{children}</div>
    </section>
  );
}