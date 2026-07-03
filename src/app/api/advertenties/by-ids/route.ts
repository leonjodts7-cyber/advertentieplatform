import { NextResponse } from "next/server";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { fetchAdvertentiesByIds } from "@/lib/advertentie-queries";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam?.trim()) {
    return NextResponse.json({ advertenties: [], fotos: {} });
  }

  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (ids.length === 0) {
    return NextResponse.json({ advertenties: [], fotos: {} });
  }

  const supabase = await createClient();
  const advertenties = await fetchAdvertentiesByIds(supabase, ids);
  const fotosMap = await haalEersteFotos(supabase, advertenties.map((a) => a.id));
  const fotos = Object.fromEntries(fotosMap);

  return NextResponse.json({ advertenties, fotos });
}
