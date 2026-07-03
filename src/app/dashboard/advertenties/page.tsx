import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardAdvertentiesContent } from "@/components/dashboard-advertenties-content";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { isProviderRole } from "@/lib/user-role";
import { resolveUserRole } from "@/lib/user-role-server";

export const metadata: Metadata = {
  title: "Mijn advertenties",
};

export default async function DashboardAdvertentiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/advertenties");

  const role = await resolveUserRole(supabase, user);
  if (!isProviderRole(role)) redirect("/zoeken");

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("aanbieder_id", user.id)
    .order("aangemaakt_op", { ascending: false });

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return <DashboardAdvertentiesContent advertenties={advertenties} fotos={fotos} />;
}
