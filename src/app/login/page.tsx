"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { vertaalAuthFout } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Tab = "inloggen" | "registreren";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("inloggen");
  const [wachtwoordVergeten, setWachtwoordVergeten] = useState(false);

  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [wachtwoordBevestig, setWachtwoordBevestig] = useState("");
  const [leeftijdBevestigd, setLeeftijdBevestigd] = useState(false);

  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  function resetMeldingen() {
    setFout(null);
    setSucces(null);
  }

  function switchTab(next: Tab) {
    setTab(next);
    setWachtwoordVergeten(false);
    resetMeldingen();
    setWachtwoord("");
    setWachtwoordBevestig("");
    setLeeftijdBevestigd(false);
  }

  async function handleInloggen(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetMeldingen();
    setLaden(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: wachtwoord,
      });

      if (error) {
        setFout(vertaalAuthFout(error));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setFout(vertaalAuthFout(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setLaden(false);
    }
  }

  async function handleRegistreren(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetMeldingen();

    if (wachtwoord.length < 8) {
      setFout("Het wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }
    if (wachtwoord !== wachtwoordBevestig) {
      setFout("De wachtwoorden komen niet overeen.");
      return;
    }
    if (!leeftijdBevestigd) {
      setFout("Je moet bevestigen dat je 18+ bent.");
      return;
    }

    setLaden(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: wachtwoord,
      });

      if (error) {
        setFout(vertaalAuthFout(error));
        return;
      }

      const emailBevestigingNodig = Boolean(data.user && !data.session);

      setSucces(
        emailBevestigingNodig
          ? "Controleer je e-mail om je account te bevestigen."
          : "Account aangemaakt. Je kunt nu inloggen."
      );
      setWachtwoord("");
      setWachtwoordBevestig("");
      setLeeftijdBevestigd(false);
      setTab("inloggen");
    } catch (err) {
      setFout(vertaalAuthFout(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setLaden(false);
    }
  }

  async function handleWachtwoordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetMeldingen();

    if (!email.trim()) {
      setFout("Voer je e-mailadres in om een resetlink te ontvangen.");
      return;
    }

    setLaden(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setFout(vertaalAuthFout(error));
        return;
      }

      setSucces(
        "Resetlink verstuurd. Controleer je e-mail om je wachtwoord te wijzigen."
      );
      setWachtwoordVergeten(false);
    } catch (err) {
      setFout(vertaalAuthFout(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setLaden(false);
    }
  }

  return (
    <div className="login-page flex min-h-[70vh] items-center py-10">
      <div className="container">
        <div className="login-card glass-panel relative mx-auto max-w-md overflow-hidden p-6 sm:p-8">
          <h1 className="login-card__title font-display text-2xl text-foreground">
            Welkom bij Veloura
          </h1>
          <p className="login-card__subtitle mt-2 text-sm text-muted-foreground">
            Log in of maak een account aan om jouw dashboard te gebruiken.
          </p>

          {!wachtwoordVergeten && (
            <div className="login-tabs mt-6" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "inloggen"}
                className={cn(
                  "login-tabs__btn",
                  tab === "inloggen" && "login-tabs__btn--active"
                )}
                onClick={() => switchTab("inloggen")}
              >
                Inloggen
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "registreren"}
                className={cn(
                  "login-tabs__btn",
                  tab === "registreren" && "login-tabs__btn--active"
                )}
                onClick={() => switchTab("registreren")}
              >
                Registreren
              </button>
            </div>
          )}

          {succes && (
            <p className="login-alert login-alert--success mt-4" role="status">
              {succes}
            </p>
          )}
          {fout && (
            <p className="login-alert login-alert--error mt-4" role="alert">
              {fout}
            </p>
          )}

          {wachtwoordVergeten ? (
            <form onSubmit={handleWachtwoordReset} className="mt-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Vul je e-mailadres in. We sturen je een link om je wachtwoord te
                resetten.
              </p>
              <div>
                <label htmlFor="reset-email" className="form-label">
                  E-mailadres
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  variant="light"
                  required
                  autoComplete="email"
                  placeholder="jij@voorbeeld.be"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={laden}>
                {laden ? "Bezig…" : "Resetlink sturen"}
              </Button>
              <button
                type="button"
                className="login-link w-full text-center text-sm"
                onClick={() => {
                  setWachtwoordVergeten(false);
                  resetMeldingen();
                }}
              >
                ← Terug naar inloggen
              </button>
            </form>
          ) : tab === "inloggen" ? (
            <form onSubmit={handleInloggen} className="mt-5 space-y-4">
              <div>
                <label htmlFor="login-email" className="form-label">
                  E-mailadres
                </label>
                <Input
                  id="login-email"
                  type="email"
                  variant="light"
                  required
                  autoComplete="email"
                  placeholder="jij@voorbeeld.be"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="form-label">
                  Wachtwoord
                </label>
                <Input
                  id="login-password"
                  type="password"
                  variant="light"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="login-link text-sm"
                onClick={() => {
                  setWachtwoordVergeten(true);
                  resetMeldingen();
                }}
              >
                Wachtwoord vergeten
              </button>
              <Button type="submit" className="w-full" size="lg" disabled={laden}>
                {laden ? "Bezig…" : "Inloggen"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegistreren} className="mt-5 space-y-4">
              <div>
                <label htmlFor="register-email" className="form-label">
                  E-mailadres
                </label>
                <Input
                  id="register-email"
                  type="email"
                  variant="light"
                  required
                  autoComplete="email"
                  placeholder="jij@voorbeeld.be"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="register-password" className="form-label">
                  Wachtwoord
                </label>
                <Input
                  id="register-password"
                  type="password"
                  variant="light"
                  required
                  autoComplete="new-password"
                  placeholder="Minimaal 8 tekens"
                  minLength={8}
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="register-password-confirm" className="form-label">
                  Wachtwoord bevestigen
                </label>
                <Input
                  id="register-password-confirm"
                  type="password"
                  variant="light"
                  required
                  autoComplete="new-password"
                  placeholder="Herhaal wachtwoord"
                  minLength={8}
                  value={wachtwoordBevestig}
                  onChange={(e) => setWachtwoordBevestig(e.target.value)}
                />
              </div>
              <label className="login-checkbox flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={leeftijdBevestigd}
                  onChange={(e) => setLeeftijdBevestigd(e.target.checked)}
                  className="login-checkbox__input mt-0.5"
                />
                <span className="text-sm text-muted-foreground">
                  Ik bevestig dat ik 18+ ben.
                </span>
              </label>
              <Button type="submit" className="w-full" size="lg" disabled={laden}>
                {laden ? "Bezig…" : "Account aanmaken"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="login-link font-medium">
              ← Terug naar Veloura
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
