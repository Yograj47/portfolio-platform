import { Connect } from "@/components/public/connect";
import { CurrentStatus } from "@/components/public/current-status";
import { FileView } from "@/components/public/file-view";
import { Hero } from "@/components/public/hero";
import { QuickFacts } from "@/components/public/quick-facts";
import { TechFocus } from "@/components/public/tech-focus";

export default function HomePage() {
  return (
    <FileView
  title="README.md"
  meta="Markdown"
>
  <div className="space-y-16">
    {/* Row 1 */}
    <div className="grid gap-8 lg:grid-cols-2">
      <Hero />

      <CurrentStatus />
    </div>

    {/* Row 2 */}
    <QuickFacts />

    {/* Row 3 */}
    <div className="grid gap-8 lg:grid-cols-2">
      <TechFocus />

      <Connect />
    </div>
  </div>
</FileView>
  );
}