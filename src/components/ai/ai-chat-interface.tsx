"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CompanionVisual } from "@/components/ai/companion-visual";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AiCompanion } from "@/lib/ai-companions";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";

interface ChatBericht {
  id: string;
  rol: "user" | "assistant" | "system";
  inhoud: string;
}

interface AiChatInterfaceProps {
  companion: AiCompanion;
  ingelogd: boolean;
  creditsSaldo: number;
  initialBerichten?: Pick<ChatBericht, "rol" | "inhoud">[];
}

export function AiChatInterface({
  companion,
  ingelogd,
  creditsSaldo,
  initialBerichten,
}: AiChatInterfaceProps) {
  const [berichten, setBerichten] = useState<ChatBericht[]>(() => {
    const seed = initialBerichten?.length
      ? initialBerichten
      : [{ rol: "assistant" as const, inhoud: companion.voorbeeldBericht }];
    return seed.map((b, i) => ({
      id: `seed-${i}`,
      rol: b.rol,
      inhoud: b.inhoud,
    }));
  });
  const [input, setInput] = useState("");
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(creditsSaldo);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const creditsNodig = companion.kostenPerBericht;
  const heeftCredits = saldo >= creditsNodig;
  const kanChatten = ingelogd && heeftCredits && !laden;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [berichten, laden]);

  async function handleVersturen(e: React.FormEvent) {
    e.preventDefault();
    const tekst = input.trim();
    if (!tekst || !kanChatten) return;

    setFout(null);
    setInput("");
    const userId = `user-${Date.now()}`;
    setBerichten((prev) => [
      ...prev,
      { id: userId, rol: "user", inhoud: tekst },
    ]);
    setLaden(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personageSlug: companion.id,
          bericht: tekst,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        saldo?: number;
        assistantBericht?: { inhoud: string };
      };

      if (!res.ok) {
        if (res.status === 401) {
          setFout("Je bent niet ingelogd. Log opnieuw in om verder te chatten.");
        } else if (res.status === 402) {
          setSaldo(data.saldo ?? saldo);
          setFout("Onvoldoende credits. Koop credits om verder te chatten.");
        } else {
          setFout(data.error ?? "Bericht versturen mislukt. Probeer opnieuw.");
        }
        return;
      }

      if (typeof data.saldo === "number") {
        setSaldo(data.saldo);
      }

      const antwoord =
        data.assistantBericht?.inhoud ??
        "Ik kon even geen antwoord geven. Probeer het opnieuw.";

      setBerichten((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, rol: "assistant", inhoud: antwoord },
      ]);
    } catch {
      setFout("Verbinding mislukt. Controleer je internet en probeer opnieuw.");
    } finally {
      setLaden(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="ai-chat-layout">
      <aside className="ai-chat-sidebar">
        <div className="ai-chat-sidebar__card">
          <div className="ai-chat-sidebar__media">
            <CompanionVisual companion={companion} priority />
          </div>
          <div className="ai-chat-sidebar__content">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="ai-chat-sidebar__name">
                {companion.naam}, {companion.leeftijd}
              </h1>
              <Badge variant="online" className="text-[0.5625rem]">
                Online
              </Badge>
            </div>
            <p className="ai-chat-sidebar__type">{companion.type}</p>
            <div className="ai-chat-sidebar__tags">
              {companion.traits.slice(0, 2).map((trait) => (
                <span key={trait} className="ai-companion-card__tag">
                  {trait}
                </span>
              ))}
              <span className="ai-companion-card__tag">Fictief 21+</span>
            </div>
            <p className="ai-chat-sidebar__bio">{companion.beschrijving}</p>
            <p className="ai-chat-sidebar__price">
              {creditsNodig} credits per bericht
            </p>
            {ingelogd ? (
              <p className="ai-chat-sidebar__saldo">
                Saldo: <strong>{saldo}</strong> credits
              </p>
            ) : null}
            <div className="ai-chat-sidebar__actions">
              {!ingelogd ? (
                <Button asChild className="w-full" size="sm">
                  <Link href={`/login?redirect=/ai/${companion.id}`}>
                    Inloggen om te chatten
                  </Link>
                </Button>
              ) : !heeftCredits ? (
                <Button asChild className="w-full" size="sm">
                  <Link href="/credits">Credits kopen</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/credits">Meer credits</Link>
                </Button>
              )}
              <Link href="/ai-lounge" className="ai-chat-sidebar__back">
                ← Terug naar AI Lounge
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <div className="ai-chat-main">
        <div className="ai-chat-main__toolbar">
          <p className="ai-chat-main__toolbar-text">
            Chat met <span className="text-[var(--gold)]">{companion.naam}</span>
            {" · "}
            fictief AI-personage 21+
          </p>
          {ingelogd && (
            <span className="ai-chat-main__saldo-pill">{saldo} credits</span>
          )}
        </div>

        <div ref={scrollRef} className="ai-chat-messages">
          <div className="ai-chat-messages__inner">
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
                    "ai-chat-bubble",
                    b.rol === "user" && "ai-chat-bubble--user",
                    b.rol === "assistant" && "ai-chat-bubble--assistant",
                    b.rol === "system" && "ai-chat-bubble--system"
                  )}
                >
                  {b.inhoud}
                </div>
              </div>
            ))}
            {laden && (
              <div className="flex justify-start">
                <div className="ai-chat-bubble ai-chat-bubble--assistant ai-chat-bubble--typing">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  <span>{companion.naam} typt…</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ai-chat-composer">
          {!ingelogd ? (
            <div className="ai-chat-composer__gate">
              <p>Log in om een gesprek te starten met {companion.naam}.</p>
              <Button asChild size="sm">
                <Link href={`/login?redirect=/ai/${companion.id}`}>Inloggen</Link>
              </Button>
            </div>
          ) : !heeftCredits ? (
            <div className="ai-chat-composer__gate">
              <p>
                Je hebt minimaal {creditsNodig} credits nodig per bericht. Saldo:{" "}
                {saldo}.
              </p>
              <Button asChild size="sm">
                <Link href="/credits">Credits kopen</Link>
              </Button>
            </div>
          ) : (
            <>
              {fout && (
                <p className="ai-chat-composer__error" role="alert">
                  {fout}
                </p>
              )}
              <form onSubmit={handleVersturen} className="ai-chat-composer__form">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleVersturen(e);
                    }
                  }}
                  placeholder={`Stuur een bericht naar ${companion.naam}…`}
                  rows={1}
                  disabled={laden}
                  className="ai-chat-composer__input"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || laden}
                  className="ai-chat-composer__send"
                  aria-label="Verstuur bericht"
                >
                  {laden ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
