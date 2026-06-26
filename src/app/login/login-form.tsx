"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { vertaalAuthFout } from "@/lib/auth-errors";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

type Tab = "inloggen" | "registreren";
type View = Tab | "bevestiging" | "verlopen";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<View>("inloggen");
  const [wachtwoordVergeten, setWachtwoordVergeten] = useState(false);

  const [email, setEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [wachtwoordBevestig, setWachtwoordBevestig] = useState("");
  const [leeftijdBevestigd, setLeeftijdBevestigd] = useState(false);

  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("confirmed") === "1") {
      setView("inloggen");
      setSucces(
        "Je e-mailadres is succesvol bevestigd. Je kan nu inloggen."
      );
      setFout(null);
    } else if (searchParams.get("error") === "expired") {
      setView("verlopen");
      setFout(null);
      setSucces(null);
    } else if (searchParams.get("error") === "auth") {
      setView("inloggen");
      setFout(
        "Activatie mislukt. Vraag een nieuwe bevestigingsmail aan of probeer opnieuw in te loggen."
      );
    }
  }, [searchParams]);

  function resetMeldingen() {
    setFout(null);
    setSucces(null);
  }

  function switchTab(next: Tab) {
    setView(next);
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

    const trimmedEmail = email.trim();
    setLaden(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: wachtwoord,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        setFout(vertaalAuthFout(error));
        return;
      }

      setPendingEmail(trimmedEmail);
      setWachtwoord("");
      setWachtwoordBevestig("");
      setLeeftijdBevestigd(false);
      setView("bevestiging");
      setFout(null);
      setSucces(null);
    } catch (err) {
      setFout(vertaalAuthFout(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setLaden(false);
    }
  }

  async function handleBevestigingOpnieuw(overrideEmail?: string) {
    const targetEmail = (overrideEmail ?? pendingEmail ?? email).trim();
    if (!targetEmail) {
      setFout("Voer je e-mailadres in om een nieuwe bevestigingsmail te ontvangen.");
      return;
    }

    resetMeldingen();
    setLaden(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: targetEmail,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        setFout(vertaalAuthFout(error));
        return;
      }

      setPendingEmail(targetEmail);
      setSucces("Nieuwe bevestigingsmail verstuurd. Controleer je inbox.");
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
    <div className="login-card glass-panel relative mx-auto max-w-md overflow-hidden p-6 sm:p-8">
      {view === "bevestiging" ? (
        <div className="login-confirm-screen">
          <div className="login-confirm-screen__icon" aria-hidden>
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="login-card__title font-display text-2xl text-foreground">
            Controleer je e-mail
          </h1>
          <p className="login-card__subtitle mt-2 text-sm text-muted-foreground">
            We hebben een activatielink gestuurd naar{" "}
            <strong className="text-foreground">{pendingEmail}</strong>.
          </p>
          <ol className="login-confirm-screen__steps mt-5 space-y-2 text-sm text-muted-foreground">
            <li>1. Open je inbox (controleer ook spam).</li>
            <li>2. Klik op <strong className="text-foreground">Account activeren</strong>.</li>
            <li>3. Kom terug en log in met je gegevens.</li>
          </ol>
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
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={laden}
              onClick={() => handleBevestigingOpnieuw()}
            >
              {laden ? "Bezig…" : "Bevestigingsmail opnieuw sturen"}
            </Button>
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={() => {
                setEmail(pendingEmail);
                setView("inloggen");
                resetMeldingen();
              }}
            >
              Naar inloggen
            </Button>
          </div>
        </div>
      ) : view === "verlopen" ? (
        <div className="login-confirm-screen">
          <h1 className="login-card__title font-display text-2xl text-foreground">
            Activatielink verlopen
          </h1>
          <p className="login-alert login-alert--error mt-4" role="alert">
            Deze activatielink is verlopen. Vraag een nieuwe bevestigingsmail aan.
          </p>
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
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleBevestigingOpnieuw(email);
            }}
          >
            <div>
              <label htmlFor="resend-email" className="form-label">
                E-mailadres
              </label>
              <Input
                id="resend-email"
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
              {laden ? "Bezig…" : "Nieuwe bevestigingsmail sturen"}
            </Button>
            <button
              type="button"
              className="login-link w-full text-center text-sm"
              onClick={() => {
                setView("inloggen");
                resetMeldingen();
              }}
            >
              ← Terug naar inloggen
            </button>
          </form>
        </div>
      ) : (
        <>
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
                aria-selected={view === "inloggen"}
                className={cn(
                  "login-tabs__btn",
                  view === "inloggen" && "login-tabs__btn--active"
                )}
                onClick={() => switchTab("inloggen")}
              >
                Inloggen
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "registreren"}
                className={cn(
                  "login-tabs__btn",
                  view === "registreren" && "login-tabs__btn--active"
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
          ) : view === "inloggen" ? (
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="login-link font-medium">
          ← Terug naar Veloura
        </Link>
      </p>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="login-card glass-panel mx-auto max-w-md p-6 sm:p-8">
      <div className="h-40 animate-pulse rounded-xl bg-white/5" />
    </div>
  );
}

export function LoginPageContent() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
