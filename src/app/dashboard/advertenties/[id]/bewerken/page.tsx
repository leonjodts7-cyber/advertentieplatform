import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { BewerkAdvertentieForm } from "@/components/bewerk-advertentie-form";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

interface BewerkAdvertentiePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Advertentie bewerken" };
}

export default async function BewerkAdvertentiePage({
  params,
}: BewerkAdvertentiePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: advertentieRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const advertentie = advertentieRaw as Advertentie | null;

  if (!advertentie) {
    notFound();
  }

  if (advertentie.aanbieder_id !== user.id) {
    redirect("/dashboard/advertenties");
  }

  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/dashboard/advertenties"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Mijn advertenties
      </Link>

      <h1 className="section-title mt-4">Advertentie bewerken</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pas jouw advertentie aan of vraag publicatie aan.
      </p>

      <div className="card-premium mt-8 max-w-2xl p-6 sm:p-8">
        <BewerkAdvertentieForm advertentie={advertentie} />
      </div>
    </div>
  );
}
