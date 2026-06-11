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
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    <div className="flex min-h-[70vh] items-center py-10">
      <div className="container">
        <div className="glass-panel relative mx-auto max-w-md overflow-hidden p-6 sm:p-8">
          <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Veloura Account
          </p>
          <h1 className="font-display mt-2 text-2xl text-foreground">
            Inloggen
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ontvang een magic link om in te loggen op jouw aanbieder-dashboard.
          </p>

          {verzonden ? (
            <div className="mt-5 rounded-xl border border-champagne/25 bg-champagne/10 p-4 text-sm text-foreground">
              Link verstuurd naar{" "}
              <strong className="text-champagne-light">{email.trim()}</strong>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                />
              </div>
              {fout && (
                <p className="text-sm text-destructive" role="alert">
                  {fout}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={laden}
              >
                {laden ? "Versturen..." : "Stuur magic link"}
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="font-medium text-champagne-light hover:underline"
            >
              ← Terug naar Veloura
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
