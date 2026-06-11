"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import { Button } from "@/components/ui/button";
import type { AiCompanion } from "@/lib/ai-companions";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface ChatBericht {
  id: string;
  rol: "user" | "assistant" | "system";
  inhoud: string;
}

interface AiChatInterfaceProps {
  companion: AiCompanion;
  previewMode?: boolean;
}

export function AiChatInterface({
  companion,
  previewMode = true,
}: AiChatInterfaceProps) {
  const [berichten, setBerichten] = useState<ChatBericht[]>([
    {
      id: "intro",
      rol: "assistant",
      inhoud: companion.voorbeeldBericht,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [berichten]);

  function handleVersturen(e: React.FormEvent) {
    e.preventDefault();
    const tekst = input.trim();
    if (!tekst) return;

    setInput("");
    setBerichten((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, rol: "user", inhoud: tekst },
      {
        id: `system-${Date.now()}`,
        rol: "system",
        inhoud:
          "Creditsysteem wordt gekoppeld. Binnenkort kun je dit gesprek starten.",
      },
    ]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Companion profiel — desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-white/10 p-4 lg:block">
        <div className="profile-card overflow-hidden">
          <ProfilePhotoPlaceholder variant={companion.photoVariant} />
          <div className="p-4">
            <p className="font-display text-lg text-foreground">
              {companion.naam}, {companion.leeftijd}
            </p>
            <p className="mt-1 text-sm text-champagne/90">{companion.type}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Fictief AI-personage · 21+
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-white/10 bg-[#1d171d]/60 px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="text-soft-champagne">
                {companion.kostenPerBericht} credits per bericht
              </span>
            </p>
            <Link
              href="/credits"
              className="text-sm font-medium text-champagne hover:underline"
            >
              Koop credits om verder te chatten →
            </Link>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {berichten.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "flex",
                  b.rol === "user"
                    ? "justify-end"
                    : b.rol === "system"
                      ? "justify-center"
                      : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]",
                    b.rol === "user" &&
                      "rounded-br-md bg-wine/45 text-foreground",
                    b.rol === "assistant" &&
                      "rounded-bl-md border border-white/10 bg-[#1d171d]/90 text-foreground",
                    b.rol === "system" &&
                      "max-w-full rounded-xl border border-champagne/20 bg-champagne/5 px-4 py-2 text-center text-xs text-soft-champagne"
                  )}
                >
                  {b.inhoud}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#141014]/95 p-3 backdrop-blur-lg sm:p-4">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleVersturen} className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleVersturen(e);
                  }
                }}
                placeholder="Typ jouw bericht..."
                rows={1}
                className="min-h-[44px] flex-1 resize-none rounded-2xl border border-white/12 bg-[#1d171d]/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/20"
              />
              <Button
                type="submit"
                disabled={!input.trim()}
                className="h-11 w-11 shrink-0 rounded-full p-0"
                aria-label="Verstuur"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
