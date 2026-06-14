import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AiLoungeTeaser() {
  return (
    <section className="discovery-section discovery-teaser">
      <div className="container">
        <div className="discovery-teaser__card">
          <div className="discovery-teaser__icon">
            <Sparkles className="h-5 w-5 text-[#d6b36b]" strokeWidth={1.5} />
          </div>
          <div className="discovery-teaser__content">
            <h2 className="font-display text-lg font-medium text-[#fff6ef] sm:text-xl">
              AI Lounge
            </h2>
            <p className="mt-1 text-sm text-[#c2b4ab]">
              Ontdek onze fictieve AI companions.
            </p>
          </div>
          <Button asChild variant="secondary" size="md" className="shrink-0">
            <Link href="/ai-lounge">Naar AI Lounge</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
