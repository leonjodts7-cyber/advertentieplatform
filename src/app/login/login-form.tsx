"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { vertaalAuthFout } from "@/lib/auth-errors";
import { getAuthCallbackUrl, getSafeRedirectPath } from "@/lib/auth-redirect";
import { RoleChoicePanel } from "@/components/role-choice-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/contexts/locale-context";
import {
  getRoleFromUser,
  isProviderRole,
  needsRoleChoice,
} from "@/lib/user-role";
import { setUserRole } from "@/lib/user-role-client";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

type Tab = "inloggen" | "registreren";
type View = Tab | "bevestiging" | "verlopen" | "rolkeuze";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

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
    if (searchParams.get("tab") === "registreren") {
      setView("registreren");
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("confirmed") === "1") {
      setView("inloggen");
      setSucces(t("auth.confirmed"));
      setFout(null);
    } else if (searchParams.get("error") === "expired") {
      setView("verlopen");
      setFout(null);
      setSucces(null);
    } else if (searchParams.get("error") === "auth") {
      setView("inloggen");
      setFout(t("auth.authFailed"));
    }
  }, [searchParams, t]);

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

  async function navigateAfterAuth() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const redirectParam =
      searchParams.get("redirect") ?? searchParams.get("next");
    const intent = searchParams.get("intent");

    if (intent === "provider" && user) {
      await setUserRole("provider");
    }

    if (redirectParam) {
      router.push(getSafeRedirectPath(redirectParam, "/zoeken"));
      router.refresh();
      return;
    }

    if (user && needsRoleChoice(user)) {
      setView("rolkeuze");
      return;
    }

    const role = getRoleFromUser(user);
    router.push(isProviderRole(role) ? "/dashboard" : "/zoeken");
    router.refresh();
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

      await navigateAfterAuth();
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
      setFout(t("auth.passwordMin"));
      return;
    }
    if (wachtwoord !== wachtwoordBevestig) {
      setFout(t("auth.passwordMismatch"));
      return;
    }
    if (!leeftijdBevestigd) {
      setFout(t("auth.ageRequired"));
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
      setFout(t("auth.email"));
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
      setSucces(t("auth.resend"));
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
      setFout(t("auth.email"));
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

      setSucces(t("auth.resetPassword"));
      setWachtwoordVergeten(false);
    } catch (err) {
      setFout(vertaalAuthFout(err instanceof Error ? err : new Error(String(err))));
    } finally {
      setLaden(false);
    }
  }

  return (
    <div className="login-card glass-panel relative mx-auto max-w-md overflow-hidden p-6 sm:p-8">
      {view === "rolkeuze" ? (
        <RoleChoicePanel />
      ) : view === "bevestiging" ? (
        <div className="login-confirm-screen">
          <div className="login-confirm-screen__icon" aria-hidden>
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="login-card__title font-display text-2xl text-foreground">
            {t("auth.checkEmail")}
          </h1>
          <p className="login-card__subtitle mt-2 text-sm text-muted-foreground">
            {t("auth.checkEmailText")}{" "}
            <strong className="text-foreground">{pendingEmail}</strong>.
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
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={laden}
              onClick={() => void handleBevestigingOpnieuw()}
            >
              {laden ? t("auth.loading") : t("auth.resend")}
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
              {t("auth.backLogin")}
            </Button>
          </div>
        </div>
      ) : view === "verlopen" ? (
        <div className="login-confirm-screen">
          <h1 className="login-card__title font-display text-2xl text-foreground">
            {t("auth.expiredTitle")}
          </h1>
          <p className="login-alert login-alert--error mt-4" role="alert">
            {t("auth.expiredText")}
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
                {t("auth.email")}
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
              {laden ? t("auth.loading") : t("auth.resend")}
            </Button>
            <button
              type="button"
              className="login-link w-full text-center text-sm"
              onClick={() => {
                setView("inloggen");
                resetMeldingen();
              }}
            >
              ← {t("auth.backLogin")}
            </button>
          </form>
        </div>
      ) : (
        <>
          <h1 className="login-card__title font-display text-2xl text-foreground">
            {t("auth.welcome")}
          </h1>
          <p className="login-card__subtitle mt-2 text-sm text-muted-foreground">
            {t("auth.welcomeSubtitle")}
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
                {t("auth.login")}
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
                {t("auth.register")}
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
              <p className="text-sm text-muted-foreground">{t("auth.resetHint")}</p>
              <div>
                <label htmlFor="reset-email" className="form-label">
                  {t("auth.email")}
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
                {laden ? t("auth.loading") : t("auth.resetPassword")}
              </Button>
              <button
                type="button"
                className="login-link w-full text-center text-sm"
                onClick={() => {
                  setWachtwoordVergeten(false);
                  resetMeldingen();
                }}
              >
                ← {t("auth.backLogin")}
              </button>
            </form>
          ) : view === "inloggen" ? (
            <form onSubmit={handleInloggen} className="mt-5 space-y-4">
              <div>
                <label htmlFor="login-email" className="form-label">
                  {t("auth.email")}
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
                  {t("auth.password")}
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
                {t("auth.forgotPassword")}
              </button>
              <Button type="submit" className="w-full" size="lg" disabled={laden}>
                {laden ? t("auth.loading") : t("auth.login")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegistreren} className="mt-5 space-y-4">
              <div>
                <label htmlFor="register-email" className="form-label">
                  {t("auth.email")}
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
                  {t("auth.password")}
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
                  {t("auth.passwordConfirm")}
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
                <span className="text-sm text-muted-foreground">{t("auth.ageConfirm")}</span>
              </label>
              <Button type="submit" className="w-full" size="lg" disabled={laden}>
                {laden ? t("auth.loading") : t("auth.createAccount")}
              </Button>
            </form>
          )}
        </>
      )}

      {view !== "rolkeuze" && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="login-link font-medium">
            ← {t("auth.backHome")}
          </Link>
        </p>
      )}
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
