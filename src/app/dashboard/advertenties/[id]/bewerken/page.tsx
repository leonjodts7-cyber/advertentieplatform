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
    <div>
      <div className="page-header-band">
        <div className="container">
          <Link
            href="/dashboard/advertenties"
            className="text-sm text-veloura-soft hover:text-veloura-champagne"
          >
            ← Mijn advertenties
          </Link>
          <h1 className="section-title mt-3">Advertentie bewerken</h1>
          <p className="section-subtitle mt-2">
            Pas jouw advertentie aan of vraag publicatie aan.
          </p>
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="luxury-card mx-auto max-w-2xl p-6 sm:p-8">
          <BewerkAdvertentieForm advertentie={advertentie} />
        </div>
      </div>
    </div>
  );
}
