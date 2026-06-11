import Link from "next/link";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { Button } from "@/components/ui/button";
import { getCompanionPreviews } from "@/lib/ai-companions";
import { Sparkles } from "lucide-react";

export function AiLoungeHomeSection() {
  const previews = getCompanionPreviews(["valentina", "scarlett", "isabella"]);

  return (
    <section className="section-spacing border-b border-white/10 bg-[#100b10]/40">
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-champagne">
              <Sparkles className="h-3.5 w-3.5" />
              Premium module
            </div>
            <h2 className="section-title">AI Lounge</h2>
            <p className="section-subtitle mt-1 max-w-lg">
              Ontdek fictieve AI companions en chat per bericht met credits.
            </p>
          </div>
          <Button asChild variant="primary" className="w-full sm:w-auto">
            <Link href="/ai-lounge">Open AI Lounge</Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {previews.map((companion) => (
            <AiCompanionCard
              key={companion.id}
              companion={companion}
              ingelogd
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
