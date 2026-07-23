import { ArrowRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="h-full rounded-md border p-8">
      <div className="space-y-3">
        <p className="font-mono text-sm text-primary">
          Hello World 👋
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight lg:text-6xl">
          Hi, I'm Han Li
        </h1>

        <p className="max-w-3xl text-xl text-muted-foreground">
          Full Stack Developer focused on building scalable,
          maintainable and user-friendly web applications.
        </p>
      </div>

      <div className="max-w-3xl space-y-4">
        <p className="leading-8 text-muted-foreground">
          I enjoy solving real-world problems through software,
          designing clean architectures, and continuously learning
          modern technologies. My interests include backend systems,
          frontend development, databases, DevOps, and system design.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button>
          Explore Projects
          <ArrowRight className="ml-2 size-4" />
        </Button>

        <Button
          variant="outline"
        >
          Download Resume
          <Download className="ml-2 size-4" />
        </Button>
      </div>
    </section>
  );
}