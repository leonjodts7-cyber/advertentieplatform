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
    <div>
      <div className="page-header-band">
        <div className="container">
          <Link
            href="/dashboard/advertenties"
            className="text-sm text-muted-foreground hover:text-champagne-light"
          >
            ← Mijn advertenties
          </Link>
          <h1 className="section-title mt-3">Nieuwe advertentie</h1>
          <p className="section-subtitle mt-2">
            Vul de gegevens in. Je advertentie wordt als concept opgeslagen.
            Alleen 18+.
          </p>
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="glass-panel mx-auto max-w-2xl p-6 sm:p-8">
          <NieuweAdvertentieForm aanbiederId={user.id} />
        </div>
      </div>
    </div>
  );
}
