import { NextResponse } from "next/server";
import { parseZoekQuery } from "@/lib/ai/parse-zoek-query";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query is verplicht." },
        { status: 400 }
      );
    }

    const filters = await parseZoekQuery(query);
    return NextResponse.json({ filters });
  } catch {
    return NextResponse.json(
      { error: "Zoekopdracht kon niet worden verwerkt." },
      { status: 500 }
    );
  }
}
