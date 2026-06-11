"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [laden, setLaden] = useState(false);
  const [verzonden, setVerzonden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLaden(true);
    setFout(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setLaden(false);

    if (error) {
      setFout(error.message);
      return;
    }

    setVerzonden(true);
  }

  return (
    <div className="flex min-h-[70vh] items-center py-12 sm:py-16">
      <div className="container">
        <div className="card-premium relative mx-auto max-w-md overflow-hidden p-6 sm:p-8">
          <div className="gradient-placeholder-gold absolute inset-0 opacity-10" />
          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-champagne">
              Account
            </p>
            <h1 className="font-display mt-2 text-2xl font-medium text-foreground sm:text-3xl">
              Inloggen
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ontvang een magic link per e-mail om in te loggen op jouw
              dashboard.
            </p>

            {verzonden ? (
              <div className="mt-6 rounded-xl border border-champagne/25 bg-champagne/5 p-4">
                <p className="text-sm text-foreground">
                  We hebben een inloglink gestuurd naar{" "}
                  <strong className="text-champagne">{email.trim()}</strong>.
                  Open de link in je e-mail om verder te gaan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="form-label">
                    E-mailadres
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="jij@voorbeeld.be"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                {fout && (
                  <p className="text-sm text-destructive" role="alert">
                    {fout}
                  </p>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={laden}>
                  {laden ? "Versturen..." : "Stuur magic link"}
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Nog geen account?{" "}
              <Link
                href="/login"
                className="text-champagne transition-colors hover:text-champagne/80"
              >
                Registreren via magic link
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
