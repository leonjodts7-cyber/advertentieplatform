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
    <div className="container py-12 sm:py-20">
      <div className="card-premium mx-auto max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground">Inloggen</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ontvang een magic link per e-mail om in te loggen op jouw dashboard.
        </p>

        {verzonden ? (
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <p className="text-sm text-foreground">
              We hebben een inloglink gestuurd naar{" "}
              <strong>{email.trim()}</strong>. Open de link in je e-mail om
              verder te gaan naar jouw dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                E-mailadres
              </label>
              <Input
                id="email"
                type="email"
                required
                placeholder="jij@voorbeeld.nl"
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

            <Button type="submit" className="w-full" disabled={laden}>
              {laden ? "Versturen..." : "Stuur magic link"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nog geen account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Registreren gaat via dezelfde magic link
          </Link>
        </p>
      </div>
    </div>
  );
}
