import Link from "next/link";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { Button } from "@/components/ui/button";
import { getCompanionPreviews } from "@/lib/ai-companions";

export function AiLoungeHomeSection() {
  const previews = getCompanionPreviews(["scarlett", "victoria", "isabella"]);

  return (
    <section className="marketplace-section border-b border-white/10">
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">AI Lounge</h2>
            <p className="section-subtitle mt-1 max-w-lg">
              Chat met fictieve volwassen companions. Betaal per bericht met
              credits.
            </p>
          </div>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
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
