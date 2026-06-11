"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AiBericht } from "@/lib/ai-types";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface ChatBericht {
  id?: string;
  rol: "user" | "assistant";
  inhoud: string;
  credits_gebruikt?: number;
  aangemaakt_op?: string;
}

interface AiChatInterfaceProps {
  personageSlug: string;
  personageNaam: string;
  initialBerichten: AiBericht[];
  initialSaldo: number;
  creditsPerBericht: number;
}

export function AiChatInterface({
  personageSlug,
  personageNaam,
  initialBerichten,
  initialSaldo,
  creditsPerBericht,
}: AiChatInterfaceProps) {
  const [berichten, setBerichten] = useState<ChatBericht[]>(
    initialBerichten.map((b) => ({
      id: b.id,
      rol: b.rol,
      inhoud: b.inhoud,
      credits_gebruikt: b.credits_gebruikt,
      aangemaakt_op: b.aangemaakt_op,
    }))
  );
  const [input, setInput] = useState("");
  const [saldo, setSaldo] = useState(initialSaldo);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [berichten, laden]);

  async function handleVersturen(e: React.FormEvent) {
    e.preventDefault();
    const tekst = input.trim();
    if (!tekst || laden) return;

    if (saldo < creditsPerBericht) {
      setFout("Onvoldoende credits. Koop credits om verder te chatten.");
      return;
    }

    setFout(null);
    setLaden(true);
    setInput("");

    const optimistisch: ChatBericht = { rol: "user", inhoud: tekst };
    setBerichten((prev) => [...prev, optimistisch]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personageSlug, bericht: tekst }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBerichten((prev) => prev.slice(0, -1));
        setInput(tekst);
        if (res.status === 402) {
          setSaldo(data.saldo ?? saldo);
          setFout("Onvoldoende credits. Koop credits om verder te chatten.");
        } else {
          setFout(data.error ?? "Bericht versturen mislukt.");
        }
        return;
      }

      setSaldo(data.saldo);
      setBerichten((prev) => {
        const zonderOptimistisch = prev.slice(0, -1);
        return [
          ...zonderOptimistisch,
          { rol: "user", inhoud: tekst, credits_gebruikt: creditsPerBericht },
          {
            id: data.assistantBericht?.id,
            rol: "assistant",
            inhoud: data.assistantBericht?.inhoud ?? "",
          },
        ];
      });
    } catch {
      setBerichten((prev) => prev.slice(0, -1));
      setInput(tekst);
      setFout("Verbinding mislukt. Probeer opnieuw.");
    } finally {
      setLaden(false);
      inputRef.current?.focus();
    }
  }

  const onvoldoendeCredits = saldo < creditsPerBericht;

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6"
      >
        {berichten.length === 0 && (
          <div className="mx-auto max-w-md py-8 text-center">
            <p className="font-display text-lg text-foreground">
              Start jouw gesprek met {personageNaam}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fictieve AI Companion · 21+ · {creditsPerBericht} credits per
              bericht
            </p>
          </div>
        )}

        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {berichten.map((b, i) => (
            <div
              key={b.id ?? i}
              className={cn(
                "flex",
                b.rol === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]",
                  b.rol === "user"
                    ? "rounded-br-md bg-wine/60 text-foreground"
                    : "rounded-bl-md border border-white/10 bg-white/[0.06] text-foreground"
                )}
              >
                {b.inhoud}
              </div>
            </div>
          ))}

          {laden && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-champagne/60" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-champagne/40 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-champagne/20 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#08070a]/95 p-3 backdrop-blur-lg sm:p-4">
        <div className="mx-auto max-w-2xl">
          {fout && (
            <div className="mb-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-300">
              {fout}
              {onvoldoendeCredits && (
                <Link
                  href="/credits"
                  className="ml-2 font-medium text-champagne-light underline"
                >
                  Credits kopen
                </Link>
              )}
            </div>
          )}

          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {creditsPerBericht} credits per bericht · saldo:{" "}
              <span className="text-champagne-light">{saldo}</span>
            </span>
            <Link href="/credits" className="text-champagne hover:underline">
              + Credits
            </Link>
          </div>

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
              placeholder={
                onvoldoendeCredits
                  ? "Koop credits om te chatten..."
                  : "Typ jouw bericht..."
              }
              disabled={laden || onvoldoendeCredits}
              rows={1}
              className="min-h-[44px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/20 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={laden || !input.trim() || onvoldoendeCredits}
              className="h-11 w-11 shrink-0 rounded-full p-0"
              aria-label="Versturen"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
