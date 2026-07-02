import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FavorietenGrid } from "@/components/favorieten-grid";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { haalFavorietAdvertenties } from "@/lib/favorieten-queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mijn favorieten",
  description: "Je opgeslagen advertenties op Veloura.",
};

export default async function FavorietenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/favorieten");
  }

  const advertenties = await haalFavorietAdvertenties(supabase, user.id);
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div className="search-page search-page--compact favorieten-page">
      <div className="search-page-top search-page-top--compact">
        <div className="container">
          <h1 className="search-page-top__title">Mijn favorieten</h1>
          <p className="search-page-top__subtitle">Je opgeslagen advertenties.</p>
        </div>
      </div>

      <div className="container search-page__body">
        <FavorietenGrid advertenties={advertenties} fotos={fotos} />
      </div>
    </div>
  );
}
