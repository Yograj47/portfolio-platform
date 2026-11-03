import { ReactNode } from "react";

interface FileViewProps {
  children: ReactNode;
}

export function FileView({ children }: FileViewProps) {
  return (
    <section>
      <div className="w-full">{children}</div>
    </section>
  );
}
