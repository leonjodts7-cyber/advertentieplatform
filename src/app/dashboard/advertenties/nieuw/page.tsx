import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { NieuweAdvertentieForm } from "@/components/nieuwe-advertentie-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nieuwe advertentie",
};

export default async function NieuweAdvertentiePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/dashboard/advertenties"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Mijn advertenties
      </Link>

      <h1 className="section-title mt-4">Nieuwe advertentie</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Vul de gegevens in. Je advertentie wordt als concept opgeslagen. Alleen
        18+.
      </p>

      <div className="card-premium mt-8 max-w-2xl p-6 sm:p-8">
        <NieuweAdvertentieForm aanbiederId={user.id} />
      </div>
    </div>
  );
}
