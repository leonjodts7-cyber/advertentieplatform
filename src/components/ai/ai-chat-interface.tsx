"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CompanionAvatar } from "@/components/ai/companion-avatar";
import { Button } from "@/components/ui/button";
import type { AiCompanion } from "@/lib/ai-companions";
import { cn } from "@/lib/utils";
import { Coins, Send } from "lucide-react";

interface ChatBericht {
  id: string;
  rol: "user" | "assistant" | "system";
  inhoud: string;
}

interface AiChatInterfaceProps {
  companion: AiCompanion;
  /** UI-preview: geen API/credits backend */
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
  const [fout, setFout] = useState<string | null>(null);
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

    setFout(null);
    setInput("");

    const userBericht: ChatBericht = {
      id: `user-${Date.now()}`,
      rol: "user",
      inhoud: tekst,
    };

    if (previewMode) {
      setBerichten((prev) => [
        ...prev,
        userBericht,
        {
          id: `system-${Date.now()}`,
          rol: "system",
          inhoud:
            "Creditsysteem wordt gekoppeld. Binnenkort kun je dit gesprek starten.",
        },
      ]);
      return;
    }

    // Backend flow blijft beschikbaar voor latere activatie
    setBerichten((prev) => [...prev, userBericht]);
  }

  return (
    <>
      {/* Credits statusblok */}
      <div className="border-b border-white/10 bg-[#100b10]/80 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4 text-champagne" />
            <span className="text-muted-foreground">
              Berichten kosten{" "}
              <strong className="text-champagne-light">
                {companion.kostenPerBericht} credits
              </strong>
            </span>
          </div>
          <Link
            href="/credits"
            className="text-sm font-medium text-champagne-light hover:underline"
          >
            Koop credits om te chatten →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
      >
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
              {b.rol === "assistant" && (
                <div className="mr-2 mt-1 shrink-0">
                  <CompanionAvatar
                    companion={companion}
                    size="sm"
                    showInitials
                  />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]",
                  b.rol === "user" &&
                    "rounded-br-md bg-wine/50 text-foreground shadow-sm",
                  b.rol === "assistant" &&
                    "rounded-bl-md border border-white/10 bg-white/[0.06] text-foreground",
                  b.rol === "system" &&
                    "max-w-full rounded-xl border border-champagne/20 bg-champagne/5 px-4 py-2 text-center text-xs text-champagne-light"
                )}
              >
                {b.inhoud}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#08070a]/95 p-3 backdrop-blur-lg sm:p-4">
        <div className="mx-auto max-w-2xl">
          {fout && (
            <div className="mb-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-300">
              {fout}
            </div>
          )}

          <p className="mb-2 text-center text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Fictief AI · 21+ · {companion.kostenPerBericht} credits per bericht
          </p>

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
              className="min-h-[44px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/20"
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
    </>
  );
}
