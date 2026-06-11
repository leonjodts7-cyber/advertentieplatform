import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AiChatInterface } from "@/components/ai/ai-chat-interface";
import { CompanionAvatar } from "@/components/ai/companion-avatar";
import { Badge } from "@/components/ui/badge";
import { getCompanionById } from "@/lib/ai-companions";

interface AiChatPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AiChatPageProps): Promise<Metadata> {
  const { id } = await params;
  const companion = getCompanionById(id);
  if (!companion) return { title: "AI Companion" };
  return {
    title: `Chat met ${companion.naam}`,
    description: `Chat met ${companion.naam} (${companion.leeftijd}) — fictieve AI Companion op Veloura.`,
  };
}

export default async function AiChatPage({ params }: AiChatPageProps) {
  const { id } = await params;
  const companion = getCompanionById(id);
  if (!companion) notFound();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col sm:min-h-[calc(100vh-3.75rem)]">
      <div className="glass-nav border-b border-white/10">
        <div className="container flex items-center gap-3 py-3">
          <Link
            href="/ai-lounge"
            className="shrink-0 text-sm text-muted-foreground hover:text-champagne-light"
          >
            ← Lounge
          </Link>

          <CompanionAvatar
            companion={companion}
            size="md"
            showInitials
            className="shrink-0 rounded-xl"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-base text-foreground sm:text-lg">
                {companion.naam}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                  {companion.leeftijd}
                </span>
              </p>
              <Badge variant="green">
                <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Online
              </Badge>
            </div>
            <p className="truncate text-xs text-champagne-light sm:text-sm">
              {companion.type}
            </p>
          </div>

          <Badge variant="muted" className="hidden shrink-0 sm:inline-flex">
            Fictief 21+
          </Badge>
        </div>
      </div>

      <AiChatInterface companion={companion} previewMode />
    </div>
  );
}
